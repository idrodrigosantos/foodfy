// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o multer
const multer = require('../app/middlewares/multer');

// Importa o controller
const RecipeController = require('../app/controllers/RecipeController');

// Controle de sessão
const { onlyUsers, allowEditMyRecipe } = require('../app/middlewares/session');

// Rotas recipes
routes.get('/', onlyUsers, RecipeController.index);
routes.get('/create', onlyUsers, RecipeController.create);
routes.post('/', onlyUsers, multer.array('photo', 5), RecipeController.post);
routes.get('/:id', onlyUsers, RecipeController.show);
routes.get('/:id/edit', onlyUsers, allowEditMyRecipe, RecipeController.edit);
routes.put('/', onlyUsers, multer.array('photo', 5), RecipeController.put);
routes.delete('/', onlyUsers, RecipeController.delete);

// Exporta o arquivo
module.exports = routes;