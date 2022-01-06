const router = require("express").Router()
const userController = require("../controllers/userController")
const auth = require("../middlewares/authMiddleware")
const upload = require("../middlewares/multer")


// authentication
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/logout", auth.authenticateToken, userController.logout)

// profile
router.get("/profile", auth.authenticateToken, userController.userProfile)
router.post("/avatar", auth.authenticateToken, upload.single("picture"), userController.uploadAvatar)

module.exports = router;