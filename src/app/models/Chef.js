// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    index(callback) {
        db.query('SELECT * FROM chefs ORDER BY id ASC', function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Cadastra instrutor
    create(data, callback) {
        const query = `
            INSERT INTO chefs(
                name,
                avatar_url,                
                created_at
            ) VALUES ($1, $2, $3)
            RETURNING id
        `;

        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    // Encontra um instrutor
    find(id, callback) {
        db.query(`SELECT chefs.*, COUNT(recipes) AS total_recipes FROM chefs 
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id) 
        WHERE chefs.id = $1 GROUP BY chefs.id`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows[0]);
        });
    },
    findRecipe(id, callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes 
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id) 
        WHERE chefs.id = $1`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows)
        });
    },
    // Atualiza os dados do instrutor
    update(data, callback) {
        const query = `
            UPDATE chefs SET
            name=($1),
            avatar_url=($2)            
            WHERE id = $3
        `;

        const values = [
            data.name,
            data.avatar_url,
            data.id
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback();
        });
    },
    // Verificação se chef tem receita
    checkChefHasRecipe(id, callback) {
        db.query(`SELECT COUNT (id) AS total_recipes 
        FROM recipes WHERE chef_id = $1`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback(results.rows[0].total_recipes);
        });
    },
    // Deleta instrutor
    delete(id, callback) {
        db.query('DELETE FROM chefs WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback();
        });
    }
};