const mongoose = require("mongoose");
const { isEmail } = require("validator")

const userSchema = new mongoose.Schema(
    {
        pseudo: {
            type: String,
            required: true,
            unique: true,
            minlength: 3,
            maxlength: 50,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            validate: [isEmail],
            trim: true,
        },
        firstname: {
            type: String,
            required: false,
            unique: false,
            minlength: 3,
            maxlength: 50,
        },
        lastname: {
            type: String,
            required: false,
            unique: false,
            minlength: 3,
            maxlength: 50,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
        },
        role: {
            type: String,
            default: "user"
        },
        picture: {
            type: String
        },
        followers: {
            type: [String]
        },
        following: {
            type: [String]
        },
        likes: {
            type: [String]
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model("user", userSchema);

module.exports = User;