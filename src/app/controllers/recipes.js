// Importa o modelo
const Recipe = require('../models/Recipe');

module.exports = {
    // Página inicial do admin
    index(req, res) {
        Recipe.index(function (recipes) {
            return res.render('admin/recipes/index', { recipes });
        });
    },
    // Página para cadastro de receita
    create(req, res) {
        Recipe.chefsSelectOptions(function (options) {
            return res.render('admin/recipes/create', { chefOptions: options });
        });
    },
    // Cadastra receita
    post(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Recipe.create(req.body, function (recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`);
        });
    },
    // Mostra receita
    show(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            // Se não tiver um aluno
            if (!recipe) {
                return res.send('Receita não foi encontrada.');
            }

            return res.render('admin/recipes/show', { recipe });
        });
    },
    // Página para editar receita
    edit(req, res) {
        Recipe.find(req.params.id, function (recipe) {
            // Se não tiver um aluno
            if (!recipe) {
                return res.send('Receita não foi encontrada.');
            }

            Recipe.chefsSelectOptions(function (options) {
                return res.render('admin/recipes/edit', { recipe, chefOptions: options });
            });
        });
    },
    // Salva alterações da receita
    put(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Recipe.update(req.body, function () {
            return res.redirect(`/admin/recipes/${req.body.id}`);
        });
    },
    // Deleta receita
    delete(req, res) {
        Recipe.delete(req.body.id, function () {
            return res.redirect('/admin/recipes');
        });
    }
};