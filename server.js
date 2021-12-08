require("dotenv").config();
const express = require("express");
const client = require("./app/database");




const app = express();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})



