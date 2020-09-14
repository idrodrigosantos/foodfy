// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o controller
const UserController = require('../app/controllers/UserController');

// Validator
const UserValidator = require('../app/validators/user');

// Controle de sessão
const { onlyAdmin } = require('../app/middlewares/session');

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/', onlyAdmin, UserController.list);
routes.get('/create', onlyAdmin, UserController.create);
routes.post('/create', onlyAdmin, UserValidator.post, UserController.post);
routes.get('/:id/edit', onlyAdmin, UserController.edit);
routes.put('/', onlyAdmin, UserValidator.update, UserController.put);
routes.delete('/', onlyAdmin, UserController.delete);

// Exporta o arquivo
module.exports = routes;