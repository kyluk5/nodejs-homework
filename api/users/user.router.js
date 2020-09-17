const { Router } = require("express");
const router = Router();
const Joi = require("joi");

const { validate } = require("../helpers/validate");
const { runAsyncWrapper } = require("../helpers/AsyncWrapper");
const { addNewUser } = require("./user.controller");

const createUserScheme = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post(
  "/register",
  validate(createUserScheme),
  runAsyncWrapper(addNewUser)
);

exports.userRouter = router;
