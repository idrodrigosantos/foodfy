const User = require('../models/User');

module.exports = {
    async index(req, res) {
        try {
            const { user } = req;

            return res.render('admin/users/profile', { user });
        } catch (error) {
            console.error(error);
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

            return res.render('admin/users/profile', {
                user: req.body,
                success: 'Conta atualizada com sucesso.'
            });
        } catch (error) {
            console.error(error);

            return res.render('admin/users/profile', {
                error: 'Algum erro aconteceu.'
            });
        }
    }
};