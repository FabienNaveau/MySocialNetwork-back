const multer = require("multer");
//const path = require("path");
const storage = multer.diskStorage({
    destination: "public",
    
    filename: function (req, file, cb) {
     
        let extension;
        if (file.mimetype == 'image/png') extension = 'png';
        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg') extension = 'jpg'
        const uniqueSuffix = req.user.pseudo
        cb(null, uniqueSuffix + '.' + extension)
    }
})
const upload = multer({
    storage:storage
});

module.exports = upload;