// Importando o arquivo data.json
const data = require('../data.json');

// Index
exports.index = function (req, res) {
    return res.render('website/index', { recipes: data.recipes });
}

// Sobre
exports.sobre = function (req, res) {
    return res.render('website/sobre');
}

// Receitas
exports.receitas = function (req, res) {
    return res.render('website/receitas', { recipes: data.recipes });
}

// Receita individual
exports.receita = function (req, res) {
    const { id } = req.params;

    const foundRecipe = data.recipes.find(function (recipe) {
        return recipe.id == id;
    });

    if (!foundRecipe) {
        return res.send('Receita não foi encontrada.');
    }

    const recipe = {
        ...foundRecipe
    }

    return res.render('website/receita', { recipe });
}