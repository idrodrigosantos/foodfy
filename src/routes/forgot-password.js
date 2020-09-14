// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o controller
const SessionController = require('../app/controllers/SessionController');

// Validator
const SessionValidator = require('../app/validators/session');

// Esqueceu senha
routes.get('/', SessionController.forgotForm);
routes.post('/', SessionValidator.forgot, SessionController.forgot);

// Exporta o arquivo
module.exports = routes;