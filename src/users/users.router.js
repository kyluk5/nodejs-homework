const { Router } = require("express");
const router = Router();
const { getContacts, getById } = require("./users.controller");

router.get("/api/contacts", getContacts);

router.get("/api/contacts/:contactId", getById);

exports.userRouter = router;
