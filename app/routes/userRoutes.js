const router = require("express").Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/authMiddleware")

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/me", auth.authenticateToken, (req, res) => {
    res.json({user: req.user})
})
router.get("/logout", auth.authenticateToken, userController.logout)

module.exports = router;