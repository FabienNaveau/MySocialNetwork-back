const mongoose = require("mongoose");

const client = mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Database connected"))
    .catch(error => console.log("Failed to connect to database", error))

module.exports = client;

