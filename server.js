require("dotenv").config();
const express = require("express");
const client = require("./app/database");
const userRoutes = require("./app/routes/userRoutes");
const cors = require("cors")

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api/user", userRoutes)

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
})



