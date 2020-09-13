// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    list(user) {
        try {
            return db.query(`SELECT * FROM users WHERE id != ${user} ORDER BY id`);
        } catch (err) {
            console.log(err);
        }
    },
    async create(data) {
        try {
            const query = `INSERT INTO users (
                name,
                email,
                password,
                is_admin
            ) VALUES ($1, $2, $3, $4)
            RETURNING id`;

            if (data.is_admin == null) {
                data.is_admin = false;
            } else {
                data.is_admin = true;
            }

            const values = [
                data.name,
                data.email,
                data.passwordHash,
                data.is_admin
            ];

            const results = await db.query(query, values);

            return results.rows[0].id;
        } catch (err) {
            console.log(err);
        }
    },
    async findOne(filters) {
        try {
            let query = 'SELECT * FROM users';

            Object.keys(filters).map(key => {
                // WHERE | OR | AND
                query = `
                ${query}
                ${key}
            `;

                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}'`;
                });
            });

            const results = await db.query(query);

            return results.rows[0];
        } catch (err) {
            console.log(err);
        }
    },
    async update(id, fields) {
        try {
            let query = 'UPDATE users SET';

            Object.keys(fields).map((key, index, array) => {
                if ((index + 1) < array.length) {
                    query = `${query}
                    ${key} = '${fields[key]}',
                `;
                } else {
                    // Última iteração
                    query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `;
                }
            });

            return db.query(query);
        } catch (err) {
            console.log(err);
        }
    },
    async updateAdmin(data) {
        try {
            const query = `UPDATE users SET 
                    name = $1,
                    email = $2,
                    is_admin = $3
                WHERE id = $4`;

            if (data.is_admin == null) {
                data.is_admin = false;
            } else {
                data.is_admin = true;
            }

            const values = [
                data.name,
                data.email,
                data.is_admin,
                data.id
            ];

            return db.query(query, values);
        } catch (err) {
            console.log(err);
        }
    },
    // Faz a remoção do usuário
    async delete(id) {
        try {
            return db.query('DELETE FROM users WHERE id = $1', [id]);
        } catch (err) {
            console.log(err);
        }
    }
};