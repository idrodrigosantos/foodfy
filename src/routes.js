// Configuração de rotas
const express = require('express');
const routes = express.Router();

// Importa o multer
const multer = require('./app/middlewares/multer');

// Importa os controllers
const HomeController = require('./app/controllers/HomeController');
const RecipeController = require('./app/controllers/RecipeController');
const ChefController = require('./app/controllers/ChefController');
const UserController = require('./app/controllers/UserController');
const SessionController = require('./app/controllers/SessionController');
const ProfileController = require('./app/controllers/ProfileController');

// Validators
const UserValidator = require('./app/validators/user');
const SessionValidator = require('./app/validators/session');
const ProfileValidator = require('./app/validators/profile');

// Controle de sessão
const {
    isLoggedRedirectToUsers,
    onlyUsers,
    onlyAdmin,
    allowEditMyRecipe
} = require('./app/middlewares/session');

// Rotas website
routes.get('/', HomeController.index);
routes.get('/sobre', HomeController.about);
routes.get('/receitas', HomeController.recipes);
routes.get('/receita/:id', HomeController.recipe);
routes.get('/chefs', HomeController.chefs);
routes.get('/pesquisa', HomeController.search);

// Rotas recipes
routes.get('/admin/recipes', onlyUsers, RecipeController.index);
routes.get('/admin/recipes/create', onlyUsers, RecipeController.create);
routes.post('/admin/recipes', onlyUsers, multer.array('photo', 5), RecipeController.post);
routes.get('/admin/recipes/:id', onlyUsers, RecipeController.show);
routes.get('/admin/recipes/:id/edit', onlyUsers, allowEditMyRecipe, RecipeController.edit);
routes.put('/admin/recipes', onlyUsers, multer.array('photo', 5), RecipeController.put);
routes.delete('/admin/recipes', onlyUsers, RecipeController.delete);

// Rotas chefs
routes.get('/admin/chefs', onlyUsers, ChefController.index);
routes.get('/admin/chefs/create', onlyAdmin, ChefController.create);
routes.post('/admin/chefs', onlyAdmin, multer.array('avatar', 1), ChefController.post);
routes.get('/admin/chefs/:id', onlyUsers, ChefController.show);
routes.get('/admin/chefs/:id/edit', onlyAdmin, ChefController.edit);
routes.put('/admin/chefs', onlyAdmin, multer.array('avatar', 1), ChefController.put);
routes.delete('/admin/chefs', onlyAdmin, ChefController.delete);

// Login / logout
routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);
routes.post('/logout', SessionController.logout);

// Resetar senha / esqueceu senha
routes.get('/forgot-password', SessionController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);
routes.get('/password-reset', SessionController.resetForm);
routes.post('/password-reset', SessionValidator.reset, SessionController.reset);

// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, ProfileValidator.show, ProfileController.index);
routes.put('/admin/profile', onlyUsers, ProfileValidator.update, ProfileController.put);

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', onlyAdmin, UserController.list);
routes.get('/admin/users/create', onlyAdmin, UserController.create);
routes.post('/admin/users/create', onlyAdmin, UserValidator.post, UserController.post);
routes.get('/admin/users/:id/edit', onlyAdmin, UserController.edit);
routes.put('/admin/users', onlyAdmin, UserValidator.update, UserController.put);
routes.delete('/admin/users', onlyAdmin, UserController.delete);

// Exporta o arquivo
module.exports = routes;