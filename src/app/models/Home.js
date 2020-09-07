// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    index() {
        return db.query(`SELECT recipes.*, chefs.name AS chef_name, 
            (SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id 
            WHERE recipe_id = recipes.id LIMIT 1) AS file_path 
            FROM recipes INNER JOIN chefs ON recipes.chef_id = chefs.id LIMIT 6`
        );
    },
    // Seleciona receita
    recipe(id, callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes 
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id) 
        WHERE recipes.id = $1`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows[0]);
        });
    },
    // Seleciona todos os chefs
    chefs() {
        return db.query(`SELECT chefs.*, 
            (SELECT COUNT(*) FROM recipes WHERE chef_id = chefs.id) AS total_recipes, 
            path AS file_path FROM chefs 
            LEFT JOIN files ON files.id = chefs.file_id ORDER BY created_at ASC`
        );
    },
    recipes(callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ORDER BY id`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows);
        });
    },
    // Pesquisa de receita
    search(params) {
        const { filter } = params;

        let query = '';

        let filterQuery = '';

        if (filter) {
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
        }

        const fileQuery = '(SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id WHERE recipe_id = recipes.id LIMIT 1) AS file_path'
        query = `SELECT recipes.*, chefs.name AS chef_name, ${fileQuery} FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ${filterQuery} ORDER BY updated_at DESC`;

        return db.query(query);
    },
    // Paginação
    paginate(params) {
        const { filter, limit, offset } = params;

        let query = "",
            filterQuery = "",
            totalQuery = "(SELECT COUNT(*) FROM recipes) AS total";

        if (filter) {
            filterQuery = `WHERE title ILIKE '%${filter}%'`;
            totalQuery = `(SELECT COUNT(*) FROM recipes ${filterQuery}) AS total`;
        }

        const fileQuery = '(SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id WHERE recipe_id = recipes.id LIMIT 1) AS file_path'
        query = `SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name, ${fileQuery} FROM recipes
        INNER JOIN chefs ON chefs.id = recipes.chef_id
        ORDER BY created_at DESC
        ${filterQuery}
        LIMIT ${limit} OFFSET ${offset}`;

        return db.query(query);
    },
    find(id) {
        const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
        INNER JOIN chefs ON chefs.id = recipes.chef_id
        WHERE recipes.id = $1`;

        return db.query(query, [id]);
    },
    files(id) {
        const query = `SELECT files.* FROM files 
        INNER JOIN recipe_files ON recipe_files.file_id = files.id
        WHERE recipe_id = $1`;

        return db.query(query, [id]);
    }
}