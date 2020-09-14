// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o controller
const ProfileController = require('../app/controllers/ProfileController');

// Validator
const ProfileValidator = require('../app/validators/profile');

// Controle de sessão
const { onlyUsers } = require('../app/middlewares/session');

// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, ProfileValidator.show, ProfileController.index);
routes.put('/', onlyUsers, ProfileValidator.update, ProfileController.put);

// Exporta o arquivo
module.exports = routes;