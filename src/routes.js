// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o multer
const multer = require('./app/middlewares/multer');

// Importa os controllers
const website = require('./app/controllers/website');
const recipes = require('./app/controllers/recipes');
const chefs = require('./app/controllers/chefs');

// Rotas website
routes.get('/', website.index);
routes.get('/sobre', website.about);
routes.get('/receitas', website.recipes);
routes.get('/receita/:id', website.recipe);
routes.get('/chefs', website.chefs);
routes.get('/pesquisa', website.search);

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