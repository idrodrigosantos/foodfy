// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o controller
const SessionController = require('../app/controllers/SessionController');

// Validator
const SessionValidator = require('../app/validators/session');

// Resetar senha
routes.get('/', SessionController.resetForm);
routes.post('/', SessionValidator.reset, SessionController.reset);

// Exporta o arquivo
module.exports = routes;