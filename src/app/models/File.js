// Importa a conexão com o banco de dados
const db = require('../../config/db');

// Manipulação de arquivos localmente
const fs = require('fs');

module.exports = {
    async create({ filename, path }) {
        try {
            const query = 'INSERT INTO files (name, path) VALUES ($1, $2) RETURNING id';

            return db.query(query, [filename, path]);
        } catch (err) {
            console.log(err);
        }
    },
    async delete(id) {
        try {
            const results = await db.query('SELECT * FROM files WHERE id = $1', [id]);

            const file = results.rows[0];

            fs.unlinkSync(file.path);

            return db.query('DELETE FROM files WHERE id = $1', [id]);
        } catch (err) {
            console.log(err);
        }
    }
};