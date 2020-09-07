// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    index() {
        return db.query(`SELECT chefs.*, 
            (SELECT COUNT(*) FROM recipes WHERE chef_id = chefs.id) AS total_recipes, 
            path AS file_path FROM chefs 
            LEFT JOIN files ON files.id = chefs.file_id 
            ORDER BY created_at ASC`
        );
    },
    // Cadastra chef
    create(data) {
        const query = `INSERT INTO chefs (
            name, 
            file_id, 
            created_at
        ) VALUES ($1, $2, $3) RETURNING id`;

        const values = [
            data.name,
            data.file_id,
            date(Date.now()).iso
        ];

        return db.query(query, values);
    },
    // Encontra um chef
    find(id) {
        const query = `SELECT chefs.*, 
            (SELECT COUNT(*) FROM recipes WHERE chef_id = $1) 
            AS total_recipes FROM chefs WHERE id = $1`;

        return db.query(query, [id]);
    },
    // Atualiza dados do chef
    update(data) {
        const query = `UPDATE chefs SET 
            name = $1, 
            file_id = $2 
        WHERE id = $3`;

        const values = [
            data.name,
            data.file_id,
            data.id
        ];

        return db.query(query, values);
    },
    // Deleta chef
    delete(id) {
        return db.query('DELETE FROM chefs WHERE id = $1', [id]);
    },
    findRecipesByChefId(id) {
        const fileQuery = '(SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id WHERE recipe_id = recipes.id LIMIT 1) AS file_path'
        
        const query = `SELECT recipes.*, ${fileQuery} FROM recipes WHERE chef_id = $1`;

        return db.query(query, [id]);
    },
    files(id) {
        const query = 'SELECT * FROM files WHERE id = $1';

        return db.query(query, [id]);
    }
};