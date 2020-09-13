// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos as receitas
    index(params) {
        try {
            const { limit, offset, user, userAdmin } = params;

            let query = "",
                userQuery = "",
                totalQuery = "(SELECT COUNT(*) FROM recipes) AS total";

            if (user || userAdmin) {
                if (userAdmin) {
                    userQuery = '';
                    totalQuery = "(SELECT COUNT(*) FROM recipes) AS total";
                } else {
                    userQuery = `WHERE user_id = ${user}`;
                    totalQuery = `(SELECT COUNT(*) FROM recipes WHERE user_id = ${user}) AS total`;
                }
            }

            const fileQuery = `(SELECT path FROM files
                INNER JOIN recipe_files
                ON recipe_files.file_id = files.id
                WHERE recipe_id = recipes.id LIMIT 1) AS file_path`;

            query = `SELECT recipes.*, ${totalQuery},
                chefs.name AS chef_name, ${fileQuery} FROM recipes
                INNER JOIN chefs ON chefs.id = recipes.chef_id
                ${userQuery}
                ORDER BY created_at DESC
                LIMIT ${limit} OFFSET ${offset}`;

            return db.query(query);
        } catch (err) {
            console.log(err);
        }
    },
    // Cadastra receita
    create(data, userId) {
        try {
            const query = `INSERT INTO recipes (
                title, 
                ingredients, 
                preparation, 
                information,
                chef_id,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;

            const values = [
                data.title,
                data.ingredients,
                data.preparation,
                data.information,
                data.chef_id,
                userId
            ];

            return db.query(query, values);
        } catch (err) {
            console.log(err);
        }
    },
    // Encontra receita
    find(id) {
        try {
            const query = `SELECT recipes.*, chefs.name AS chef_name FROM recipes
                INNER JOIN chefs ON chefs.id = recipes.chef_id
                WHERE recipes.id = $1`;

            return db.query(query, [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Receita da página inicial pública
    trending() {
        try {
            return db.query(`SELECT recipes.*, chefs.name AS chef_name, 
                (SELECT path FROM files INNER JOIN recipe_files ON recipe_files.file_id = files.id 
                WHERE recipe_id = recipes.id LIMIT 1) AS file_path 
                FROM recipes INNER JOIN chefs ON recipes.chef_id = chefs.id LIMIT 6`);
        } catch (err) {
            console.log(err);
        }
    },
    // Seleciona imagens da receita
    files(id) {
        try {
            const query = `SELECT files.* FROM files 
                INNER JOIN recipe_files ON recipe_files.file_id = files.id
                WHERE recipe_id = $1`;

            return db.query(query, [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Atualiza informações da receita
    update(data) {
        try {
            const query = `UPDATE recipes SET 
                title = $1, 
                ingredients = $2, 
                preparation = $3, 
                information = $4, 
                chef_id = $5
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
        } catch (err) {
            console.log(err);
        }
    },
    // Deleta receita
    delete(id) {
        try {
            return db.query('DELETE FROM recipes WHERE id = $1', [id]);
        } catch (err) {
            console.log(err);
        }
    },
    // Seleciona os chefs
    chefsSelectOptions() {
        try {
            return db.query('SELECT id, name FROM chefs');
        } catch (err) {
            console.log(err);
        }
    },
    async findRecipeWithChef(id) {
        try {
            const results = await db.query(`SELECT recipes.*, 
                chefs.name AS author FROM recipes
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
                WHERE recipes.id=$1`, [id]);

            return results.rows[0];
        } catch (err) {
            console.error(err);
        }
    },
    // Pesquisa receita
    search(params) {
        try {
            const { filter } = params;

            let query = '';

            let filterQuery = '';

            if (filter) {
                filterQuery = `WHERE recipes.title ILIKE '%${filter}%'`;
            }

            const fileQuery = `(SELECT path FROM files 
                INNER JOIN recipe_files ON recipe_files.file_id = files.id 
                WHERE recipe_id = recipes.id LIMIT 1) AS file_path`;

            query = `SELECT recipes.*, 
                chefs.name AS chef_name, 
                ${fileQuery} FROM recipes 
                LEFT JOIN chefs ON (recipes.chef_id = chefs.id) ${filterQuery} 
                ORDER BY updated_at DESC`;

            return db.query(query);
        } catch (err) {
            console.log(err);
        }
    }
};