// Importa o modelo
const Chef = require('../models/Chef');
const Recipe = require('../models/Recipe');

module.exports = {
    // Página inicial
    async index(req, res) {
        try {
            const results = await Recipe.trending();

            const recipes = results.rows.map(recipe => ({
                ...recipe,
                file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
            }));

            return res.render('home/index', { recipes });
        } catch (error) {
            console.error(error);
        }
    },
    // Sobre
    about(req, res) {
        return res.render('home/about');
    },
    // Todas receitas
    async recipes(req, res) {
        try {
            let { page, limit } = req.query;

            page = page || 1;
            limit = limit || 12;

            let offset = limit * (page - 1);

            const params = {
                limit,
                offset
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

            return res.render('home/recipes', { recipes, pagination });
        } catch (error) {
            console.error(error);
        }
    },
    // Receita individual
    async recipe(req, res) {
        try {
            const { id } = req.params;

            let results = await Recipe.find(id);

            const recipe = results.rows[0];

            results = await Recipe.files(id);

            const files = results.rows.map(file => ({
                ...file,
                src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
            }));

            if (!recipe) {
                return res.send('Receita não foi encontrada.');
            }

            return res.render('home/recipe', { recipe, files });
        } catch (error) {
            console.error(error);
        }
    },
    // Chefs
    async chefs(req, res) {
        try {
            let { page, limit } = req.query;

            page = page || 1;
            limit = limit || 12;

            let offset = limit * (page - 1);

            const params = {
                limit,
                offset
            }

            const results = await Chef.index(params);

            const chefs = results.rows.map(chef => ({
                ...chef,
                file_src: `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`
            }));

            const pagination = {
                total: chefs[0] ? Math.ceil(chefs[0].total / limit) : 0,
                page
            }

            return res.render('home/chefs', { chefs, pagination });
        } catch (error) {
            console.error(error);
        }
    },
    // Pesquisar receita
    async search(req, res) {
        try {
            let { filter } = req.query;

            const params = {
                filter
            }

            const results = await Recipe.search(params);

            const recipes = results.rows.map(recipe => ({
                ...recipe,
                file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
            }));

            return res.render('home/search', { recipes, filter });
        } catch (error) {
            console.error(error);
        }
    }
};