// Importa os modelos
const Recipe = require('../models/Recipe');
const File = require('../models/File');
const RecipeFile = require('../models/RecipeFile');

module.exports = {
    // Mostra todas receitas
    async index(req, res) {
        try {
            let { page, limit, user, userAdmin } = req.query;

            page = page || 1;
            limit = limit || 6;

            let offset = limit * (page - 1);

            user = req.session.userId;
            userAdmin = req.session.isAdmin;

            const params = {
                limit,
                offset,
                user,
                userAdmin
            }

            const results = await Recipe.index(params);

            const recipes = results.rows.map(recipe => ({
                ...recipe,
                src: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
            }));

            const pagination = {
                total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
                page
            }

            const { error, success } = req.session;
            req.session.error = '';
            req.session.success = '';

            return res.render('admin/recipes/index', { recipes, pagination, error, success });
        } catch (error) {
            console.error();
        }
    },
    // Página para cadastro de receita
    async create(req, res) {
        try {
            const results = await Recipe.chefsSelectOptions();

            const chefs = results.rows;

            const { error } = req.session;
            req.session.error = '';

            return res.render('admin/recipes/create', { chefs, error });
        } catch (error) {
            console.error();
        }
    },
    // Cadastra receita
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if ((key != 'information' && key != 'removed_files') && req.body[key] == '') {
                    // return res.send('Preencha todos os campos.');

                    req.session.error = 'Por favor, preencha todos os campos.';
                    return res.redirect('/admin/recipes/create');
                }
            }

            if (req.files.length == 0) {
                // return res.send('Por favor, envie pelo menos uma imagem.');

                req.session.error = 'Por favor, envie pelo menos uma imagem.';
                return res.redirect('/admin/recipes/create');
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

            const UserId = req.session.userId;

            const results = await Recipe.create(data, UserId);

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

            req.session.success = 'Receita criada com sucesso.';
            return res.redirect(`/admin/recipes/${recipe_id}`);
        } catch (error) {
            console.error();
        }
    },
    // Mostra receita
    async show(req, res) {
        try {
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

            const { success } = req.session;
            req.session.success = '';

            return res.render('admin/recipes/show', { recipe, files, success });
        } catch (error) {
            console.error();
        }
    },
    // Página para editar receita
    async edit(req, res) {
        try {
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

            const { error } = req.session;
            req.session.error = '';

            return res.render('admin/recipes/edit', { recipe, chefs, files, error });
        } catch (error) {
            console.error();
        }
    },
    // Salva alterações da receita
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            const { id: recipe_id } = req.body;

            for (key of keys) {
                if ((key != 'information' && key != 'removed_files') && req.body[key] == '') {
                    // return res.send('Receita não foi encontrada.');

                    req.session.error = 'Por favor, preencha todos os campos.';
                    return res.redirect(`/admin/recipes/${req.body.id}/edit`);
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

            req.session.success = 'Receita atualizada com sucesso.';
            return res.redirect(`/admin/recipes/${req.body.id}`);
        } catch (error) {
            console.error();
        }
    },
    // Deleta receita
    async delete(req, res) {
        try {
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

            req.session.success = 'Receita deletada com sucesso.';
            return res.redirect('/admin/recipes');
        } catch (error) {
            console.error();
        }
    }
};