const { pool } = require('../config/database');

const addDocument = async (nom, taille, date_ajout) => {
    const query = 'INSERT INTO docs(nom, taille, date_ajout) VALUES($1, $2, $3) RETURNING *';
    const values = [nom, taille, date_ajout];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

const getAllDocuments = async () => {
    const query = 'SELECT * FROM docs';
    const { rows } = await pool.query(query);
    return rows;
};

exports.viewFile = (req, res) => {
    const fileId = req.params.id;
    const filePath = path.join(__dirname, '../uploads', fileId + '.pdf');

    console.log("Recherche du fichier :", filePath);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Fichier introuvable" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('error', (err) => {
        console.error("Erreur lors de la lecture du fichier :", err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    });
};

module.exports = { addDocument, getAllDocuments };
