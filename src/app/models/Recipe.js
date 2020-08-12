// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos as receitas
    index() {
        const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
        INNER JOIN chefs ON recipes.chef_id = chefs.id`;

        return db.query(query);
    },
    // Cadastra receita
    create(data) {
        const query = `INSERT INTO recipes (
            title, 
            ingredients, 
            preparation, 
            information, 
            created_at, 
            chef_id
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            data.chef_id
        ];

        return db.query(query, values);
    },
    find(id) {
        const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
        INNER JOIN chefs ON chefs.id = recipes.chef_id
        WHERE recipes.id = $1`;

        return db.query(query, [id]);
    },
    findBy(filter) {
        filter = filter || '';

        const query = `SELECT *, 
            (SELECT name FROM chefs WHERE chefs.id = recipes.chef_id) 
            AS chef_name FROM recipes WHERE title ILIKE '%${filter}%'`;

        return db.query(query);
    },
    trending() {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name, 
            (SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id 
            WHERE recipe_id = recipes.id LIMIT 1) AS file_path 
            FROM recipes INNER JOIN chefs ON recipes.chef_id = chefs.id LIMIT 6`
        );
    },
    files(id) {
        const query = `SELECT files.* FROM files 
        INNER JOIN recipe_files ON recipe_files.file_id = files.id
        WHERE recipe_id = $1`;

        return db.query(query, [id]);
    },
    update(data) {
        const query = `UPDATE recipes SET 
            title = $1, 
            ingredients = $2, 
            preparation = $3, 
            information = $4, 
            chef_id =$5
        WHERE id = $6`;

        const values = [
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef_id,
            data.id,
        ];

        return db.query(query, values);
    },
    delete(id) {
        return db.query('DELETE FROM recipes WHERE id = $1', [id]);
    },
    chefsSelectOptions() {
        return db.query('SELECT id, name FROM chefs');
    },
    paginate(params) {
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = "(SELECT COUNT(*) FROM recipes) AS total";

        if (filter) {
            filterQuery = `WHERE title ILIKE '%${filter}%'`;
            totalQuery = `(SELECT COUNT(*) FROM recipes ${filterQuery}) AS total`;
        }

        const fileQuery = `(SELECT path FROM files 
            INNER JOIN recipe_files 
            ON recipe_files.file_id = files.id 
            WHERE recipe_id = recipes.id LIMIT 1) AS file_path`;

        query = `SELECT recipes.*, ${totalQuery}, 
            chefs.name AS chef_name, ${fileQuery} FROM recipes
            INNER JOIN chefs ON chefs.id = recipes.chef_id
            ${filterQuery} LIMIT ${limit} OFFSET ${offset}`;

        return db.query(query);
    }
};