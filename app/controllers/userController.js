const User = require("../models/User");
const { hash, compare } = require("bcrypt")

module.exports.signup = async (req, res) => {
    const { pseudo, email, firstname, lastname } = req.body;

    try {
        const password = await hash(req.body.password, 10)
        const user = await User.create({pseudo, email, password, firstname, lastname})
        res.status(200).json({ user })
    } catch (error) {
        console.error(error)
    }
}