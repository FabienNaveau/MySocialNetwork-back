require("dotenv").config();
const express = require("express");
require("./app/database");
const userRoutes = require("./app/routes/userRoutes");
const cors = require("cors");
var cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/user", userRoutes)

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})



