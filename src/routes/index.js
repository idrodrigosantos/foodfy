// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa os controllers
const HomeController = require('../app/controllers/HomeController');
const SessionController = require('../app/controllers/SessionController');

// Validator
const SessionValidator = require('../app/validators/session');

// Controle de sessão
const { isLoggedRedirectToUsers } = require('../app/middlewares/session');

// Importa as rotas
const home = require('./home');
const recipes = require('./recipes');
const chefs = require('./chefs');
const users = require('./users');
const profile = require('./profile');
const forgotPassword = require('./forgot-password');
const passwordReset = require('./password-reset');

// Página inicial
routes.get('/', HomeController.index);

// Usa as rotas
routes.use('/', home);
routes.use('/admin/recipes', recipes);
routes.use('/admin/chefs', chefs);
routes.use('/admin/users', users);
routes.use('/admin/profile', profile);
routes.use('/forgot-password', forgotPassword);
routes.use('/password-reset', passwordReset);

// Login / logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// Exporta o arquivo
module.exports = routes;