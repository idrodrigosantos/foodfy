// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o controller
const HomeController = require('../app/controllers/HomeController');

// Rotas website
routes.get('/sobre', HomeController.about);
routes.get('/receitas', HomeController.recipes);
routes.get('/receita/:id', HomeController.recipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/pesquisa', HomeController.search);

// Exporta o arquivo
module.exports = routes;