/// --------- Gestion Affichage -----------

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const path = require('path');
const mime = require('mime-types'); 
const app = express();

app.use(cors());
app.use(express.json());

// Configuration de multer pour la gestion des fichiers uploadés (en mémoire)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // Limite de taille du fichier : 5 Mo

// Création d'un pool de connexions à PostgreSQL
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: '123',
    database: 'docs',
});

// Connexion à la base de données PostgreSQL
(async () => {
    try {
        await pool.connect();  
        console.log("Connexion à PostgreSQL réussie");
    } catch (error) {
        console.error("Erreur de connexion à PostgreSQL :", error);
    }
})();

// Route pour obtenir tous les fichiers depuis la base de données
app.get('/files', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, filename, file_size, upload_date FROM files ORDER BY upload_date desc');
        res.json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des fichiers :', error);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour rechercher des fichiers par nom
app.get('/files/search', async (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).send('Le paramètre "query" est requis pour la recherche');
    }
    try {
        const result = await pool.query('SELECT id, filename, file_size, upload_date FROM files WHERE filename ILIKE $1', [`%${query}%`]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la recherche des fichiers :', error);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour télécharger un fichier
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé');
    }
    const courseId = req.body.course_id;
    if (!courseId) {
        return res.status(400).send('ID de cours manquant');
    }
    try {
        const query = 'INSERT INTO files (filename, file_data, file_size, course_id) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [req.file.originalname, req.file.buffer, req.file.size, courseId];
        const result = await pool.query(query, values);
        res.status(200).send({
            message: 'Fichier téléchargé avec succès',
            file: req.file,
            dbResponse: result.rows[0],
        });
    } catch (error) {
        console.error('Erreur lors de l\'insertion dans la base de données :', error);
        res.status(500).send('Erreur serveur');
    }
});

// Route pour visualiser un document pfd
app.get('/files/view/:id', async (req, res) => {
    const fileId = req.params.id;

    try {
        const result = await pool.query('SELECT file_data, filename FROM files WHERE id = $1', [fileId]);
        const file = result.rows[0];

        if (!file) {
            return res.status(404).send('Fichier non trouvé');
        }

        res.setHeader('Content-Type', getMimeType(file.filename)+ ';charset=utf-8'); // Fonction pour déterminer le type MIME
        res.send(file.file_data);
    } catch (error) {
        console.error('Erreur lors de la récupération du fichier:', error);
        res.status(500).send('Erreur serveur');
    }
});

// Fonction pour obtenir le type MIME
const getMimeType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'png': return 'image/png';
        case 'jpg':
        case 'jpeg': return 'image/jpeg';
        case 'gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
};



// Route pour récupérer les cours depuis la base de données
app.get('/courses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses ORDER BY name asc');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des cours:', err);
        res.status(500).send('Erreur interne du serveur');
    }
});

// Route pour récupérer les fichiers associés à un cours
app.get('/files/course/:courseId', (req, res) => {
    const { courseId } = req.params;
    const query = 'SELECT * FROM files WHERE course_id = $1';
    console.log(`Fetching files for course ID: ${courseId}`);  
    pool.query(query, [courseId], (err, result) => {  
        if (err) {
            console.error('Error fetching files:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des fichiers' });
        }
        console.log('Files fetched:', result.rows);
        res.json(result.rows);
    });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});


/// ------------- Gestion Affichage -------------