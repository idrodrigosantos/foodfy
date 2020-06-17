// File System
const fs = require('fs');

// Importando o arquivo data.json
const data = require('../data.json');

// Página inicial do admin
exports.index = function (req, res) {
    return res.render('admin/index', { recipes: data.recipes });
}

// Página para cadastro de receita
exports.create = function (req, res) {
    return res.render('admin/create');
}

// Mostra receita
exports.show = function (req, res) {
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

    return res.render('admin/receita', { recipe });
}

// Página para editar receita
exports.edit = function (req, res) {
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

    return res.render('admin/edit', { recipe });
}

// Cadastra receita
exports.post = function (req, res) {
    // Validação dos campos
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preencha todos os campos.');
        }
    }

    // Cria o id para receita
    let id = 1;
    const lastRecipe = data.recipes[data.recipes.length - 1];
    if (lastRecipe) {
        id = lastRecipe.id + 1;
    }

    // Adiciona o req.body no array
    data.recipes.push({
        id,
        ...req.body
    });

    // Escreve no arquivo data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('recipes');
    });
}

// Salva alterações da receita
exports.put = function (req, res) {
    const { id } = req.body;
    let index = 0;

    const foundRecipe = data.recipes.find(function (recipe, foundIndex) {
        if (id == recipe.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundRecipe) {
        return res.send('Receita não foi encontrada.');
    }

    const recipe = {
        ...foundRecipe,
        ...req.body,
        id: Number(req.body.id)
    }

    data.recipes[index] = recipe;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect(`/admin/recipes/${id}`);
    });
}

// Deleta receita
exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredRecipes = data.recipes.filter(function (recipe) {
        return recipe.id != id;
    });

    data.recipes = filteredRecipes;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('/admin/recipes');
    });
}