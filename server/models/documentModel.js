const pool = require("../config/database");

const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS docs (
            id SERIAL PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            taille INT NOT NULL,
            date_ajout TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            date_modif TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            fichier BYTEA NOT NULL
        );
    `;
    await pool.query(query);
};

createTable();

const addDocument = async (nom, taille, date_modif, fichier) => {
    const query = `
        INSERT INTO docs (nom, taille, date_modif, fichier) 
        VALUES ($1, $2, $3, $4) RETURNING *;
    `;
    const values = [nom, taille, date_modif, fichier];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

module.exports = { addDocument };

