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
  updateSubscription,
} = require("./user.controller");
const { generateAvatar } = require("../helpers/avatarCreator");

const UserScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post(
  "/register",
  validate(UserScheme),
  runAsyncWrapper(generateAvatar),
  runAsyncWrapper(addNewUser)
);

router.post("/login", validate(UserScheme), runAsyncWrapper(signIn));

router.post("/logout", runAsyncWrapper(authorize), runAsyncWrapper(logout));

router.get(
  "/current",
  runAsyncWrapper(authorize),
  runAsyncWrapper(currentUser)
);

router.patch(
  "/",
  runAsyncWrapper(authorize),
  runAsyncWrapper(updateSubscription)
);

exports.userRouter = router;
