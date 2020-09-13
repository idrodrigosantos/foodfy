// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os chefs
    index(params) {
        try {
            const { limit, offset } = params;

            let query = "", count = "";

            count = `(SELECT COUNT(*) FROM chefs) AS total,
                (SELECT COUNT(*) FROM recipes WHERE chef_id = chefs.id) AS total_recipes`;

            query = `SELECT chefs.*, 
                ${count}, 
                path AS file_path FROM chefs 
                LEFT JOIN files ON files.id = chefs.file_id 
                ORDER BY created_at ASC
                LIMIT ${limit} OFFSET ${offset}`;

            return db.query(query);
        } catch (err) {
            console.log(err);
        }
    },
    // Cadastra chef
    create(data) {
        try {
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
        } catch (err) {
            console.log(err);
        }
    },
    // Encontra chef
    find(id) {
        try {
            const query = `SELECT chefs.*, 
                (SELECT COUNT(*) FROM recipes WHERE chef_id = $1) 
                AS total_recipes FROM chefs WHERE id = $1`;

            return db.query(query, [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Atualiza dados do chef
    update(data) {
        try {
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
        } catch (err) {
            console.log(err);
        }
    },
    // Deleta chef
    delete(id) {
        try {
            return db.query('DELETE FROM chefs WHERE id = $1', [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Encontra receita do chef
    findRecipesByChefId(id) {
        try {
            const fileQuery = `(SELECT path FROM files 
                INNER JOIN recipe_files ON recipe_files.file_id = files.id 
                WHERE recipe_id = recipes.id LIMIT 1) AS file_path`;

            const query = `SELECT recipes.*, ${fileQuery} FROM recipes WHERE chef_id = $1`;

            return db.query(query, [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Encontra imagens do chef
    files(id) {
        try {
            const query = 'SELECT * FROM files WHERE id = $1';

            return db.query(query, [id]);
        } catch (err) {
            console.log(err);
        }
    }
};