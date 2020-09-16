const User = require('../models/User');

// Verifica se todos os campos estão preenchidos
function checkAllFields(body) {
    const keys = Object.keys(body);

    for (key of keys) {
        if (body[key] == '') {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            };
        }
    }
}

async function post(req, res, next) {
    // Verifica se todos os campos estão preenchidos
    const fillAllFields = checkAllFields(req.body);

    if (fillAllFields) {
        return res.render('admin/users/create', {
            user: req.body,
            error: 'Por favor, preencha todos os campos.'
        });
    }

    // Verifica se o usuário existe (email)
    let { email } = req.body;

    const user = await User.findOne({
        where: { email }
    });

    if (user) {
        return res.render('admin/users/create', {
            user: req.body,
            error: 'E-mail em uso.'
        });
    }

    next();
}

async function update(req, res, next) {
    // Verifica se todos os campos estão preenchidos
    const { id } = req.body;

    const fillAllFields = checkAllFields(req.body);

    if (fillAllFields) {
        req.session.error = 'Por favor, preencha todos os campos.';
        return res.redirect(`users/${id}/edit`);
    }

    const user = await User.findOne({
        where: { id }
    });

    req.user = user;

    next();
}

module.exports = {
    post,
    update
};