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
  updateUserInfo,
  sendVerificationEmail,
} = require("./user.controller");
const { updateImage } = require("../helpers/add&minimizeImage");

const UserScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post(
  "/register",
  validate(UserScheme),
  runAsyncWrapper(addNewUser),
  runAsyncWrapper(sendVerificationEmail)
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

router.patch(
  "/avatars",
  runAsyncWrapper(authorize),
  updateImage,
  runAsyncWrapper(updateUserInfo)
);

router.get("/verify/:verificationToken");

exports.userRouter = router;
