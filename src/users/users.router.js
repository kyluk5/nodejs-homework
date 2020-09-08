const { Router } = require("express");
const Joi = require("joi");
const router = Router();
const {
  getContacts,
  getById,
  addNewContact,
  deleteContact,
  changeContact,
} = require("./users.controller");
const { validate } = require("../helpers/validate");

const createUserScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

const updataUserScheme = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
}).min(1);

router.get("/api/contacts", getContacts);

router.get("/api/contacts/:contactId", getById);

router.post(
  "/api/contacts",
  validate(createUserScheme, "missing required name field"),
  addNewContact
);

router.delete("/api/contacts/:contactId", deleteContact);

router.patch(
  "/api/contacts/:contactId",
  validate(updataUserScheme, "missing fields"),
  changeContact
);

exports.userRouter = router;
