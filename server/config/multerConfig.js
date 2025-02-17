const multer = require("multer");
const path = require("path");

// Configuration du stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dossier où stocker les fichiers
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const upload = multer({ storage });

module.exports = upload;
