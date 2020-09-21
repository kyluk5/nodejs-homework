const { Router } = require("express");
const router = Router();
const Joi = require("joi");

const { validate } = require("../helpers/validate");
const { runAsyncWrapper } = require("../helpers/AsyncWrapper");
const {
  addNewUser,
  signIn,
  authorize,
  logout,
  currentUser,
} = require("./user.controller");

const UserScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post("/register", validate(UserScheme), runAsyncWrapper(addNewUser));

router.post("/login", validate(UserScheme), runAsyncWrapper(signIn));

router.post("/logout", runAsyncWrapper(authorize), runAsyncWrapper(logout));

router.get("/", runAsyncWrapper(authorize), runAsyncWrapper(currentUser));

exports.userRouter = router;
