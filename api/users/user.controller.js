const userModel = require("./user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  const newUser = await userModel.create({ email, password: passwordHash });

  res.status(201).send({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;
  const [existUser] = await userModel.findUserByEmail(email);

  if (existUser) {
    const validPassword = await bcrypt.compare(password, existUser.password);
    if (!validPassword) {
      return res.status(401).send("Email or password is wrong");
    }
    const token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET);
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
