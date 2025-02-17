const express = require('express');
const { Client } = require('pg');
const multer = require('multer');
const path = require('path');


const router = express.Router();
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'vocalSwitch',
    password: '123',
    port: 5432,
})

// Configuration de multer pour l'upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//  Route pour uploader un fichier
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Aucun fichier téléchargé" });
    }

    // Connexion PostgreSQL
    const client = new Client();
    await client.connect();

    try {
        const { originalname, size } = req.file;
        const query = `
            INSERT INTO docs (nom, taille, date_modif, fichier)
            VALUES ($1, $2, NOW(), $3) RETURNING *`;
        const values = [originalname, size, req.file.filename];

        const result = await client.query(query, values);

        res.status(201).json({
            message: "Fichier téléchargé avec succès",
            file: result.rows[0]
        });

    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        await client.end();
    }
});

app.get('/files/search', (req, res) => {
    const query = req.query.query;
    if (!query) {
        return res.status(400).send('Aucun fichier à rechercher');
    }
    const files = getFilesMatchingQuery(query);
    res.json(files);
});


module.exports = router;
