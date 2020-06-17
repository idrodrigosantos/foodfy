// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa os controllers
const website = require('./controllers/website');
const recipes = require('./controllers/recipes');

// Rotas website
routes.get('/', website.index);
routes.get("/sobre", website.sobre);
routes.get("/receitas", website.receitas);
routes.get("/receita/:id", website.receita);

// Rotas admin
routes.get("/admin/recipes", recipes.index);
routes.get("/admin/recipes/create", recipes.create);
routes.get("/admin/recipes/:id", recipes.show);
routes.get("/admin/recipes/:id/edit", recipes.edit);
routes.post("/admin/recipes", recipes.post);
routes.put("/admin/recipes", recipes.put);
routes.delete("/admin/recipes", recipes.delete);

// Exporta o arquivo
module.exports = routes;