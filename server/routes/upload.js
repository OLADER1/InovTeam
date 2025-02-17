// server/routes/upload.js

const express = require("express");
const multer = require("multer");
const path = require("path");
const pool = require("../config/database");
const router = express.Router();

// Configurer Multer pour sauvegarder les fichiers dans le dossier 'uploads'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Dossier où les fichiers seront sauvegardés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9); 
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Route POST pour télécharger le fichier
router.post("/upload", upload.single("fichier"), async (req, res) => {
    try {
        if (!req.file) {
        return res.status(400).send("Aucun fichier téléchargé.");
        }
        const { filename, path: filePath, size } = req.file;
        const dateModif = new Date();
        const doc = await pool.query(
        "INSERT INTO docs (nom, taille, date_modif, chemin) VALUES ($1, $2, $3, $4) RETURNING *",
        [filename, size, dateModif, filePath]
        );

        res.status(200).json({
        message: "Fichier téléchargé avec succès !",
        file: doc.rows[0], // Retourner les informations du fichier
        });
    } catch (error) {
        console.error("Erreur de téléchargement:", error);
        res.status(500).send("Erreur lors de l'upload.");
}
});

// Route GET pour récupérer un fichier
router.get("/file/:filename", (req, res) => {
    const { filename } = req.params;

    pool.query("SELECT * FROM docs WHERE nom = $1", [filename], (err, result) => {
        if (err) {
        return res.status(500).send("Erreur lors de la recherche du fichier.");
        }

        const file = result.rows[0];
        if (!file) {
        return res.status(404).send("Fichier non trouvé.");
        }

        res.sendFile(file.chemin, { root: "." }); // Retourner le fichier
});
});

module.exports = router;
