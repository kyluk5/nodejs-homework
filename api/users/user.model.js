const mongoose = require("mongoose");
const { Schema } = mongoose;

const userScheme = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const userModel = mongoose.model("Contact", userScheme);
module.exports = userModel;

// async function getContactById(contactId) {
//   const list = await listContacts();
//   return list.filter((item) => item.id === contactId);
// }

// async function removeContact(contactId) {
//   const list = await listContacts();
//   const result = list.filter((item) => item.id !== contactId);
//   await fsPromises.writeFile(contactsPath, JSON.stringify(result));
// }

// async function updateContact(id, paramsToUpdate) {
//   const list = await listContacts();
//   const contactInd = list.findIndex((user) => String(user.id) === id);
//   if (contactInd === -1) {
//     return null;
//   }
//   list[contactInd] = { ...list[contactInd], ...paramsToUpdate };
//   await fsPromises.writeFile(contactsPath, JSON.stringify([...list]));
//   return list[contactInd];
// }
