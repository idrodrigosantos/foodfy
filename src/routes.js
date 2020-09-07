// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o multer
const multer = require('./app/middlewares/multer');

// Importa os controllers
const HomeController = require('./app/controllers/HomeController');
const RecipeController = require('./app/controllers/RecipeController');
const ChefController = require('./app/controllers/ChefController');

// Rotas website
routes.get('/', HomeController.index);
routes.get('/sobre', HomeController.about);
routes.get('/receitas', HomeController.recipes);
routes.get('/receita/:id', HomeController.recipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/pesquisa', HomeController.search);

// Rotas recipes
routes.get('/admin/recipes', recipes.index)
routes.get('/admin/recipes/create', recipes.create);
routes.post('/admin/recipes', multer.array('photo', 5), recipes.post);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);
routes.put('/admin/recipes', multer.array('photo', 5), recipes.put);
routes.delete('/admin/recipes', recipes.delete);

// Rotas chefs
routes.get('/admin/chefs', chefs.index);
routes.get('/admin/chefs/create', chefs.create);
routes.post('/admin/chefs', multer.array('avatar', 1), chefs.post);
routes.get('/admin/chefs/:id', chefs.show);
routes.get('/admin/chefs/:id/edit', chefs.edit);
routes.put('/admin/chefs', multer.array('avatar', 1), chefs.put);
routes.delete('/admin/chefs', chefs.delete);

// Exporta o arquivo
module.exports = routes;