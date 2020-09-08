const contacts = require("../../contacts");
const uuid = require("uuid");

exports.getContacts = async (req, res, next) => {
  res.status(200).send(await contacts.listContacts());
};

exports.getById = async (req, res, next) => {
  const contact = await contacts.getContactById(Number(req.params.contactId));
  if (contact.length === 0) {
    return res.status(404).send("Not found");
  }
  res.status(200).send(contact);
};

exports.addNewContact = async (req, res, next) => {
  const id = uuid.v4();
  const { name, email, phone } = req.body;
  await contacts.addContact(id, name, email, phone);
  res.status(201).send({ id, name, email, phone });
};
