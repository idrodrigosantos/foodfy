// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    async create({ file_id, chef_id }) {
        try {
            const query = 'INSERT INTO chef_files (file_id, chef_id) VALUES ($1, $2)';

            return db.query(query, [file_id, chef_id]);
        } catch (err) {
            console.log(err);
        }
    },
    async delete({ file_id, chef_id }) {
        try {
            return db.query(`DELETE FROM chef_files 
                WHERE file_id = $1 AND chef_id = $2`, [file_id, chef_id]);
        } catch (err) {
            console.log(err);
        }
    }
};