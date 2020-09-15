const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { userRouter } = require("./users/user.router");
const mongoose = require("mongoose");

module.exports = class CRUDServer {
  constructor() {
    this.app = null;
  }

  async start() {
    this.initserver();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.initErrorHandling();
    this.startListening();
  }

  initserver() {
    this.app = express();
  }

  initMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("combined"));
  }

  initRoutes() {
    this.app.use("/api/contacts", userRouter);
  }

  async initDataBase() {
    await mongoose.connect(process.env.MONGO_DB_URL);
  }

  initErrorHandling() {
    this.app.use((err, req, res, next) => {
      const status = err.status || 500;
      return res.status(status).send(err.message);
    });
  }

  startListening() {
    this.app.listen(process.env.PORT, () => {
      console.log("Database connection successful");
    });
  }
};
