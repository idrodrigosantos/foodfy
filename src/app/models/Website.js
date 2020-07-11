// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    all(callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ORDER BY id`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows);
        });
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
    // Seleciona todos os instrutores
    chefs(callback) {
        db.query(`SELECT chefs.*, COUNT (recipes) AS total_recipes FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
        GROUP BY chefs.id ORDER BY id`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows);
        });
    },
    // Pesquisa de receita
    search(params) {
        const { filter, callback } = params;

        let query = '';
        let filterQuery = '';

        if (filter) {
            filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
        }

        query = `SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ${filterQuery}`;

        db.query(query, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Paginação
    paginate(params) {
        const { limit, offset, callback } = params;

        let query = '',
            totalQuery = '(SELECT COUNT (*) FROM recipes) AS total';

        query = `SELECT recipes.*, ${totalQuery} FROM recipes ORDER BY id LIMIT $1 OFFSET $2`;

        db.query(query, [limit, offset], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    }
};