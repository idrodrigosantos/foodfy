const User = require('../models/User');

// Importa os pacotes
const { hash } = require('bcryptjs');
const { randomPassword } = require('../../lib/utils');
const mailer = require('../../lib/mailer');

module.exports = {
    async list(req, res) {
        try {
            user = req.session.userId;

            const results = await User.list(user);

            const users = results.rows.map(user => ({
                ...user,
            }));

            const { error, success } = req.session;
            req.session.error = '';
            req.session.success = '';

            return res.render('admin/users/list', { users, error, success });
        } catch (error) {
            console.error(error);
        }
    },
    create(req, res) {
        const { error } = req.session;
        req.session.error = '';

        return res.render('admin/users/create', { error });
    },
    async post(req, res) {
        try {
            // Cria uma senha aleatória
            const password = randomPassword(8);

            // Hash de senha
            const passwordHash = await hash(password, 8);

            const data = {
                ...req.body,
                passwordHash
            }

            await User.create(data);

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

            req.session.success = 'Conta criada com sucesso.';
            return res.redirect('/admin/users');
        } catch (error) {
            console.error(error);
        }
    },
    async edit(req, res) {
        try {
            const { id } = req.params;

            let results = await User.find(id);

            const user = results.rows[0];

            const { error } = req.session;
            req.session.error = '';

            return res.render('admin/users/edit', { user, error });
        } catch (error) {
            console.error(error);
        }
    },
    async put(req, res) {
        try {
            const data = {
                ...req.body
            }

            await User.updateAdmin(data);

            req.session.success = 'Conta atualizada com sucesso.';
            return res.redirect('/admin/users');
        } catch (error) {
            console.error(error);

            return res.render('admin/users/edit', {
                error: 'Algum erro aconteceu.'
            });
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id);

            req.session.success = 'Conta deletada com sucesso.';
            return res.redirect('/admin/users');
        } catch (err) {
            console.error(err);

            return res.render('admin/users/list', {
                user: req.body,
                error: 'Erro ao tentar deletar sua conta.'
            });
        }
    }
};