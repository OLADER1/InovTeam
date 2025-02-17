const { Pool } = require('pg');

// Configurer la connexion à la base de données
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'docs',
    password: '123',
    port: 5432,
});

// Test de la connexion à PostgreSQL
const testConnection = async () => {
        try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Connexion à PostgreSQL réussie !', res.rows[0]);
        } catch (err) {
        console.error('❌ Erreur de connexion à PostgreSQL', err);
        }
};

testConnection();

module.exports = pool;
