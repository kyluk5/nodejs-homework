const { Router } = require("express");
const Joi = require("joi");
const router = Router();
const { getContacts, getById, addNewContact } = require("./users.controller");
const { validate } = require("../helpers/validate");

const createUserScheme = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

router.get("/api/contacts", getContacts);

router.get("/api/contacts/:contactId", getById);

router.post("/api/contacts", validate(createUserScheme), addNewContact);

exports.userRouter = router;
