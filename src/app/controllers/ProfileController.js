const User = require('../models/User');

module.exports = {
    async index(req, res) {
        const { user } = req;

        return res.render('admin/user/profile', { user });
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
    }
};