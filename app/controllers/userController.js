const User = require("../models/User");
const { hashSync, compare } = require("bcrypt")
const passwordSchema = require("../models/password");
const { validate } = require("email-validator");
const auth = require("../middlewares/authMiddleware")

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

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) return res.json({
            error: "Veuillez renseigner tous les champs"
        })

        const user = await User.findOne({email : email.toLowerCase()});
        
        // if there's no match user in database we return an error  

        if (!user) {

            res.json({
                error: 'Utilisateur inconnu'
            });
            throw new Error("L'utilisateur est déjà en base de données");
        }
        // Users in data base have crypted passwords so we have ton compare them to be sure that the crypted password correspond to the user password in the login form
        const checkingPassword = await compare(password, user.password)
    
        // if compared password's good, we send user infos to the front application and create an unique token for the user
        if (checkingPassword) {
            // we delete user's password for not send it to client
            delete user.password
            
            const accessToken = auth.generateAccessToken({
                id: user.id,
                email: user.email,
                pseudo: user.pseudo,
                firstname: user.firstname,
                lastname: user.lastname,
                role: user.role,
            });
            
            
            // we send infos to the front application
            
            res.json({
                accessToken
            })
        } else {
            return res.json({
                error: 'Mot de passe invalide.'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500);
    }
}

module.exports.logout = (req, res) => {
    if(!req.cookies.accessToken) {
        return;
    } else {
        res.clearCookie("accessToken");
        res.json({message: "Vous avez bien été déconnecté(e)"})
    }
}

module.exports.userProfile = async (req, res) => {
    const userId = req.user.id
    try {
        const user = await User.findOne({
            _id: userId
        })
        if(!user) throw Error("Personne ne correspond en base de données")
        delete user.password
        res.json({
            user: {
                pseudo: user.pseudo,
                email: user.email,
                firstname: user.firstname, 
                lastname: user.lastname,
                followers: user.followers.length,
                following: user.following.length
            }
        })
    } catch (error) {
        res.status(500)
    }
}

module.exports.uploadAvatar = async (req, res) => {
    try {
        console.log(req.file)
        if(req.file.size > 5000000) {
            res.json({erreur: "La taille de l'image doit être inférieure à 5 Mo"})
            return
        }
        await User.updateOne({pseudo: req.user.pseudo}, {$set: {picture: req.file.filename}})
        res.json({message: "Votre image a bien été modifiée"})
    } catch(error) {
        res.status(500)
    }
    
}