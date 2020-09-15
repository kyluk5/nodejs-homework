// const model = require("./user.model");
const userModel = require("./user.model");

exports.getContacts = async (req, res, next) => {
  const listContacts = await userModel.find();
  res.status(200).json(listContacts);
};

exports.getById = async (req, res, next) => {
  // const contact = await model.getContactById(Number(req.params.contactId));
  // if (contact.length === 0) {
  //   return res.status(404).send("Not found");
  // }
  // res.status(200).send(contact);
};

exports.addNewContact = async (req, res, next) => {
  const newContact = await userModel.create(req.body);
  res.status(201).json(newContact);
};

exports.deleteContact = async (req, res, next) => {
  // const contact = await model.getContactById(Number(req.params.contactId));
  // if (contact.length > 0) {
  //   await contacts.removeContact(Number(req.params.contactId));
  //   res.status(200).send("contact deleted");
  // } else {
  //   res.status(404).send("Not found");
  // }
};

exports.changeContact = async (req, res, next) => {
  // const cangedContact = await model.updateContact(
  //   req.params.contactId,
  //   req.body
  // );
  // if (cangedContact) {
  //   res.status(200).send(cangedContact);
  // } else {
  //   res.status(404).send("Not found");
  // }
};
