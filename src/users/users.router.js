const { Router } = require("express");
const router = Router();
const contacts = require("../../contacts");

router.get("/api/contacts", async (req, res, next) => {
  res.status(200).send(await contacts.listContacts());
});

exports.userRouter = router;
