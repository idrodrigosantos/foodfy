// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o multer
const multer = require('../app/middlewares/multer');

// Importa o controller
const ChefController = require('../app/controllers/ChefController');

// Controle de sessão
const { onlyUsers, onlyAdmin } = require('../app/middlewares/session');

// Rotas chefs
routes.get('/', onlyUsers, ChefController.index);
routes.get('/create', onlyAdmin, ChefController.create);
routes.post('/', onlyAdmin, multer.array('avatar', 1), ChefController.post);
routes.get('/:id', onlyUsers, ChefController.show);
routes.get('/:id/edit', onlyAdmin, ChefController.edit);
routes.put('/', onlyAdmin, multer.array('avatar', 1), ChefController.put);
routes.delete('/', onlyAdmin, ChefController.delete);

// Exporta o arquivo
module.exports = routes;