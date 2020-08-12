// Importa os modelos
const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
    // Página inicial do admin
    async index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        let offset = limit * (page - 1);

        const params = {
            filter,
            limit,
            offset,
        }

        const results = await Recipe.paginate(params);

        const recipes = [];

        const pagination = {
            total: Math.ceil(results.rows[0].total / limit),
            page,
            filter
        }

        for (let recipe of results.rows) {
            recipe = {
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${(recipe.file_path).replace('public', '')}`
            }

            recipes.push(recipe);
        }

        return res.render('admin/recipes/index', { recipes, pagination });
    },
    // Página para cadastro de receita
    async create(req, res) {
        const results = await Recipe.chefsSelectOptions();

        const chefs = results.rows;

        return res.render('admin/recipes/create', { chefs });
    },
    // Cadastra receita
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if ((key != 'information' && key != 'removed_files') && req.body[key] == '') {
                return res.send('Preencha todos os campos.');
            }
        }

        if (req.files.length == 0) {
            return res.send('Por favor, envie pelo menos uma imagem.');
        }

        let ingredients = [];

        let preparation = [];

        for (let ingredient of req.body.ingredients) {
            if (ingredient != '') {
                ingredients.push(ingredient);
            }
        }

        for (let step of req.body.preparation) {
            if (step != '') {
                preparation.push(step);
            }
        }

        const data = {
            ...req.body,
            ingredients,
            preparation
        }

        const results = await Recipe.create(data);

        const recipe_id = results.rows[0].id;

        const filesPromise = req.files.map(async file => {
            const results = await File.create(file);
            const file_id = results.rows[0].id;
            const recipeFile = {
                file_id,
                recipe_id
            }

            await RecipeFile.create(recipeFile);
        });

        await Promise.all(filesPromise);

        return res.redirect(`/admin/recipes/${recipe_id}`);
    },
    // Mostra receita
    async show(req, res) {
        const { id } = req.params;

        let results = await Recipe.find(id);

        const recipe = results.rows[0];

        if (!recipe) {
            return res.send('Receita não foi encontrada.');
        }

        results = await Recipe.files(id);

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        return res.render('admin/recipes/show', { recipe, files });
    },
    // Página para editar receita
    async edit(req, res) {
        const { id } = req.params;

        let results = await Recipe.find(id);

        const recipe = results.rows[0];

        results = await Recipe.chefsSelectOptions();

        const chefs = results.rows;

        if (!recipe) {
            return res.send('Receita não foi encontrada.');
        }

        results = await Recipe.files(id);

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        return res.render('admin/recipes/edit', { recipe, chefs, files });
    },
    // Salva alterações da receita
    async put(req, res) {
        const keys = Object.keys(req.body);

        const { id: recipe_id } = req.body;

        for (key of keys) {
            if ((key != 'information' && key != 'removed_files') && req.body[key] == '') {
                return res.send('Receita não foi encontrada.');
            }
        }

        if (req.files.length != 0) {
            const filesPromise = req.files.map(async file => {
                const results = await File.create(file);
                const file_id = results.rows[0].id;
                const recipeFile = {
                    file_id,
                    recipe_id
                }

                await RecipeFile.create(recipeFile);
            });

            await Promise.all(filesPromise);
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',');

            const lastIndex = removedFiles.length - 1;

            removedFiles.splice(lastIndex, 1);

            const removedFilesPromise = removedFiles.map(async id => {
                await RecipeFile.delete({
                    file_id: id,
                    recipe_id,
                });

                await File.delete(id);
            });

            await Promise.all(removedFilesPromise);
        }

        await Recipe.update(req.body);

        return res.redirect(`/admin/recipes/${req.body.id}`);
    },
    // Deleta receita
    async delete(req, res) {
        const { id } = req.body;

        let results = await Recipe.files(id);

        const filesPromise = results.rows.map(async file => {
            const files = {
                file_id: file.id,
                recipe_id: id
            }

            await RecipeFile.delete(files);

            await File.delete(file.id);
        });

        Promise.all(filesPromise);

        await Recipe.delete(id);

        return res.redirect(`/admin/recipes`);
    }
}