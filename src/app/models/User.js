// Importa a conexão com o banco de dados
const db = require('../../config/db');

// Importa os pacotes
const { hash } = require('bcryptjs');
const { randomPassword } = require('../../lib/utils');
const mailer = require('../../lib/mailer');

module.exports = {
    async findOne(filters) {
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

            // Cria uma senha aleatória
            const password = randomPassword(8);

            // Hash de senha
            const passwordHash = await hash(password, 8);

            if (data.is_admin == null) {
                data.is_admin = false;
            } else {
                data.is_admin = true;
            }

            const values = [
                data.name,
                data.email,
                passwordHash,
                data.is_admin
            ];

            const results = await db.query(query, values);

            await mailer.sendMail({
                to: data.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Cadastro Foodfy',
                html: `
                    <h2>Sua conta no Foodfy foi criada com sucesso.</h2>
                    <p>Informações de acesso:</p>
                    <p>E-mail: ${data.email}</p>
                    <p>Senha: ${password}</p>
                    <p>Clique no link abaixo para acessar o Foodfy</p>
                    <p>
                        <a href="http://localhost:3000/login" target="_blank">
                            ACESSAR FOODFY
                        </a>
                    </p>
                `,
            });

            return results.rows[0].id;
        } catch (err) {
            console.log(err);
        }
    },
    async update(id, fields) {
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

        await db.query(query);

        return;
    },
    async delete(id) {
        // Faz a remoção do usuário
        return db.query('DELETE FROM users WHERE id = $1', [id]);
    },
    list() {
        return db.query('SELECT * FROM users');
    },
    find(id) {
        const query = 'SELECT users.* FROM users WHERE id = $1';

        return db.query(query, [id]);
    }
};