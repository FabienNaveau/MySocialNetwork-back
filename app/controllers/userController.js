const User = require("../models/User");
const { hashSync, compare } = require("bcrypt")
const passwordSchema = require("../models/password");
const { validate } = require("email-validator")

module.exports.signup = async (req, res) => {
    
        try {
            const errors = [];
            const {
                pseudo,
                firstname,
                lastname,
                email,
                password,
                passwordConfirm,
            } = req.body;

            // all the fields are required
            if (!pseudo || !firstname || !lastname || !email || !password || !passwordConfirm) errors.push("Veuillez renseigner tous les champs.");
            
            //checkyng pseudo availability
            const userPseudoFound = await User.findOne({ pseudo }); 

            if (userPseudoFound) errors.push("Ce pseudo est déjà utilisé.")
            // if a user is in database we push an error
            const userFound = await User.findOne({ email })
            
            if(userFound) errors.push("L'adresse mail renseignée est déjà utilisée.")

            // verifying if email is in good format
            if (!validate(email)) errors.push("L'adresse mail renseignée n'est pas correcte.");

            // We compare the 2 passwords, if differents we push an error
            if (password !== passwordConfirm) errors.push("Les deux mots de passe ne sont pas identiques.");
            
            const validatePassword = passwordSchema.validate(password);
            // we push errors if user write invalid informations
            // verifying if password contains 1 uppercase letter, 1 lowercase letter, 1 digit, no spaces and greater than 8 characters
            if (!validatePassword) errors.push("Le mot de passe doit contenir 8 caractères minimum, 1 majuscule, 1 minuscule, 1 chiffre.");
            
            // if the errors array isn't empty we push all errors
            if (errors.length > 0) {
                res.json({
                    errors
                });
                throw new Error("Impossible d'entrer l'utilisateur en base de données.");
            }

            // inserting the user in database with an encrypted password
            const user = await User.create({pseudo, firstname, lastname, email, password: hashSync(password, 8)});
            await user.save()

            // we send newUser's informations
            res.json({
                user
            })
        } catch (error) {

            res.status(500)

        }
}