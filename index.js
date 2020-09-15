const CRUDServer = require("./api/server");

// new CRUDServer().start();

const mongodb = require("mongodb");
const { MongoClient } = mongodb;

const MONGO_DB_URL =
  "mongodb+srv://kyluk_test:sYG4RHSk7GXARCi@cluster0.tiuua.mongodb.net/?retryWrites=true&w=majority";

async function main() {
  const client = await MongoClient.connect(MONGO_DB_URL);

  const db = client.db("db-contacts");
  const collection = db.collection("contacts");
  //first function turned back all contacts
  const contactsList = await collection.find().toArray();
}

main();
