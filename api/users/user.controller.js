const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../helpers/errors.constructor");
const { generateAvatar } = require("../helpers/avatarCreator");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

exports.addNewUser = async (req, res, next) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT)
  );
  const [existUser] = await userModel.findUserByEmail(email);

  if (existUser) {
    return res.status(409).send("Email in use");
  }

  const avatarName = await generateAvatar();
  const avatarPath = `http://localhost:${process.env.PORT}/images/${avatarName}`;
  const verificationToken = uuid.v4();

  const newUser = await userModel.create({
    email,
    password: passwordHash,
    avatarURL: avatarPath,
    verificationToken,
  });

  res.status(201).send({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });

  req.user = newUser;
  next();
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const [existUser] = await userModel.findUserByEmail(email);

  if (existUser) {
    const validPassword = await bcrypt.compare(password, existUser.password);
    if (!validPassword) {
      return res.status(401).send("Email or password is wrong");
    }
    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60,
    });
    await userModel.updateToken(existUser._id, token);

    return res.status(200).send({
      token: token,
      user: {
        email: existUser.email,
        subscription: existUser.subscription,
      },
    });
  }
  res.status(401).send("Email or password is wrong");
};

exports.logout = async (req, res, next) => {
  const user = req.user;
  await userModel.updateToken(user._id, null);
  return res.status(204).send();
};

exports.authorize = async (req, res, next) => {
  // 1. витягнути токен користувача з заголовка Authorization
  const authorizationHeader = req.get("Authorization");
  const token = authorizationHeader.replace("Bearer ", "");

  // 2. витягнути id користувача з пейлоада або вернути користувачу
  // помилку зі статус кодом 401
  let userId;
  try {
    userId = await jwt.verify(token, process.env.JWT_SECRET).id;
  } catch (err) {
    next(new UnauthorizedError("Not authorized"));
  }

  // 3. витягнути відповідного користувача. Якщо такого немає - викинути
  // помилку зі статус кодом 401
  // userModel - модель користувача в нашій системі
  const user = await userModel.findById(userId);
  if (!user || user.token !== token) {
    throw new UnauthorizedError("Not authorized");
  }

  // 4. Якщо все пройшло успішно - передати запис користувача і токен в req
  // і передати обробку запиту на наступний middleware
  req.user = user;
  req.token = token;

  next();
};

exports.currentUser = async (req, res, next) => {
  const user = req.user;
  res.status(200).send({ email: user.email, subscription: user.subscription });
};

exports.updateSubscription = async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user._id, {
    subscription: "pro",
  });
  res.status(200).send("Subscription updated");
};

exports.updateUserInfo = async (req, res, next) => {
  const { user } = req;
  const { file } = req;

  const newImagePath = `http://localhost:3000/images/${file.filename}`;

  const updatedImage = await userModel.findByIdAndUpdate(
    user._id,
    {
      avatarURL: newImagePath,
    },
    { new: true }
  );

  res.status(200).send({
    avatarURL: updatedImage.avatarURL,
  });
};

exports.sendVerificationEmail = async (req, res, next) => {
  const { email } = req.user;
  const { verificationToken } = req.user;

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: process.env.SENDGRID_SENDER, // Change to your verified sender
    subject: "Homework Node.js",
    text: "Verification test",
    html: `<p>For verify your account, please follow this <a href='http://localhost:3000/auth/verify/${verificationToken}'>link</a></p> `,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

exports.checkVerification = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;

  const verifiedUser = userModel.findOneAndUpdate(
    { verificationToken },
    { verificationToken: null }
  );

  if (verifiedUser) {
    return res.status(200).send();
  } else {
    return res.status(404).send("User not found");
  }
};
