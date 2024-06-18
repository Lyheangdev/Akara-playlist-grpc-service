require("dotenv").config();

const mongoose = require("mongoose");

//=== Environment VARIABLES
const CONNECTION_STRING = process.env.CONNECTION_STRING;

const databaseConnector = () => {
  //=== Connection configuration
  const database = mongoose.connect(CONNECTION_STRING, {
    useNewUrlParser: true,
  });

  //=== Checking whether the connection is full-filled
  const isConnected = mongoose.connection;
  isConnected.on("error", () => console.error("Fail to connect to database."));
  return database;
};

exports.databaseConnector = databaseConnector;
