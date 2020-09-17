const userModel = require("./user.model");
const bcrypt = require("bcrypt");

exports.addNewUser = async (req, res, next) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT)
  );

  const listUsers = await userModel.find();
  const existUser = listUsers.find((user) => user.email === email);

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
