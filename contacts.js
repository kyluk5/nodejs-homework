const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

// TODO: задокументировать каждую функцию
async function listContacts() {
  return JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
}

async function getContactById(contactId) {
  const list = await listContacts();
  return list.filter((item) => item.id === contactId);
}

async function removeContact(contactId) {
  const list = await listContacts();
  const result = list.filter((item) => item.id !== contactId);
  await fsPromises.writeFile(contactsPath, JSON.stringify(result));
}

async function addContact(name, email, phone) {
  const id = uuid.v4();
  const newContact = { id, name, email, phone };
  const list = await listContacts();
  await fsPromises.writeFile(
    contactsPath,
    JSON.stringify([...list, newContact])
  );
  return newContact;
}

async function updateContact(id, paramsToUpdate) {
  const list = await listContacts();
  const contactInd = list.findIndex((user) => String(user.id) === id);
  if (contactInd === -1) {
    return null;
  }
  list[contactInd] = { ...list[contactInd], ...paramsToUpdate };
  console.log(list[contactInd]);
  await fsPromises.writeFile(contactsPath, JSON.stringify([...list]));
  return list[contactInd];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
