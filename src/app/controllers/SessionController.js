const User = require('../models/User');

const { hash } = require('bcryptjs');
const crypto = require('crypto');
const mailer = require('../../lib/mailer');

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login');
    },
    login(req, res) {
        // Se for usuário comum
        req.session.userId = req.user.id;
        // Se for admin
        req.session.isAdmin = req.user.is_admin;

        if (req.user.is_admin) {
            return res.redirect('/admin/users');
        } else {
            return res.redirect('/admin/profile');
        }
    },
    logout(req, res) {
        req.session.destroy();

        return res.redirect('/');
    },
    forgotForm(req, res) {
        return res.render('admin/session/forgot-password');
    },
    async forgot(req, res) {
        const user = req.user;

        try {
            // Token para o usuário
            const token = crypto.randomBytes(20).toString('hex');

            // Expiração do token
            let now = new Date();
            now = now.setHours(now.getHours() + 1);

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            });

            // Envia e-mail com link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `
                    <h2>Perdeu a chave?</h2>
                    <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                    <p>
                        <a href="http://localhost:3000/password-reset?token=${token}" target="_blank">
                            RECUPERAR SENHA
                        </a>
                    </p>
                `,
            });

            // Avisa o usuário que o e-mail foi enviado
            return res.render('admin/session/forgot-password', {
                success: 'Verifique seu e-mail para resetar sua senha.'
            });
        } catch (err) {
            console.error(err);

            return res.render('admin/session/forgot-password', {
                error: 'Erro inesperado, tente novamente.'
            });
        }
    },
    resetForm(req, res) {
        return res.render('admin/session/password-reset', { token: req.query.token });
    },
    async reset(req, res) {
        const user = req.user;
        const { password, token } = req.body;

        try {
            // Cria um novo hash de senha
            const newPassword = await hash(password, 8);

            //Atualiza o usuário
            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            });

            // Avisa o usuário que ele tem uma nova senha
            return res.render('admin/session/login', {
                user: req.body,
                success: 'Senha atualizada. Faça o seu login.'
            });
        } catch (err) {
            console.error(err);

            return res.render('admin/session/password-reset', {
                user: req.body,
                token,
                error: 'Erro inesperado, tente novamente.'
            });
        }
    }
};