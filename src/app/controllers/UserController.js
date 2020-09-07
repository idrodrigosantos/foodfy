const User = require('../models/User');

module.exports = {
    async list(req, res) {
        const results = await User.list();

        const users = results.rows.map(user => ({
            ...user,
        }));

        return res.render('admin/user/list', { users });
    },
    create(req, res) {
        return res.render('admin/user/create');
    },
    async post(req, res) {
        const userId = await User.create(req.body);

        req.session.userId = userId;

        return res.redirect('/admin/users');
    },
    async edit(req, res) {
        const { id } = req.params;

        let results = await User.find(id);

        const user = results.rows[0];

        return res.render('admin/user/edit', { user });
    },
    async update(req, res) {
        try {
            const { user } = req;
            let { name, email } = req.body;

            await User.update(user.id, {
                name,
                email
            });

            return res.render('admin/user/edit', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            });
        } catch (error) {
            console.error(err);

            return res.render('admin/user/edit', {
                error: 'Algum erro aconteceu.'
            });
        }
    },
    async put(req, res) {
        try {
            const { user } = req;
            let { name, email } = req.body;

            await User.update(user.id, {
                name,
                email
            });

            return res.render('admin/user/profile', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            });
        } catch (error) {
            console.error(err);

            return res.render('admin/user/profile', {
                error: 'Algum erro aconteceu.'
            });
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.body.id);

            return res.render('admin/user/list', {
                success: 'Conta deletada com sucesso.'
            });
        } catch (err) {
            console.error(err);

            return res.render('admin/user/list', {
                user: req.body,
                error: 'Erro ao tentar deletar sua conta.'
            });
        }
    }
};