// Utils
const { date } = require('../../lib/utils');

// Importa a conexação com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os instrutores
    index(callback) {
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes 
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ORDER BY id ASC`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }
            callback(results.rows);
        });
    },
    // Opção de seleção dos chefs
    chefsSelectOptions(callback) {
        db.query('SELECT name, id FROM chefs', function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback(results.rows);
        });
    },
    // Cadastra instrutor
    create(data, callback) {
        const query = `
            INSERT INTO recipes(
                title,
                image,
                ingredients,
                preparation,
                information,
                created_at,
                chef_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.title,
            data.image,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).iso,
            data.chef
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
        db.query(`SELECT recipes.*, chefs.name AS chef_name FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = $1`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    // Atualiza os dados do instrutor
    update(data, callback) {
        const query = `
            UPDATE recipes SET
            title=($1),
            image=($2),
            ingredients=($3),
            preparation=($4),
            information=($5),
            chef_id=($6)
            WHERE id = $7
        `;

        const values = [
            data.title,
            data.image,
            data.ingredients,
            data.preparation,
            data.information,
            data.chef,
            data.id
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback();
        });
    },
    // Deleta instrutor
    delete(id, callback) {
        db.query('DELETE FROM recipes WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback();
        });
    }
};