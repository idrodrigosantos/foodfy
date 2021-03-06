// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    async create({ file_id, recipe_id }) {
        try {
            const query = 'INSERT INTO recipe_files (file_id, recipe_id) VALUES ($1, $2)';

            return db.query(query, [file_id, recipe_id]);
        } catch (err) {
            console.log(err);
        }
    },
    async delete({ file_id, recipe_id }) {
        try {
            return db.query(`DELETE FROM recipe_files 
                WHERE file_id = $1 AND recipe_id = $2`, [file_id, recipe_id]);
        } catch (err) {
            console.log(err);
        }
    }
};