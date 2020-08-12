// Importa o modelo
const Website = require('../models/Website');

module.exports = {
    // Index
    async index(req, res) {
        const results = await Website.index();

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        return res.render('website/index', { recipes });
    },
    // Sobre
    about(req, res) {
        return res.render('website/sobre');
    },
    // Receitas
    async recipes(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 6;

        let offset = limit * (page - 1);

        const params = {
            filter,
            limit,
            offset
        }

        const results = await Website.paginate(params);

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        const pagination = {
            total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
            page,
            filter
        }

        return res.render('website/receitas', { recipes, pagination });
    },
    // Receita individual
    async recipe(req, res) {
        const { id } = req.params;

        let results = await Website.find(id);

        const recipe = results.rows[0];

        results = await Website.files(id);

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        if (!recipe) {
            return res.send('Receita não foi encontrada.');
        }

        return res.render('website/receita', { recipe, files });
    },
    // Chefs
    async chefs(req, res) {
        const results = await Website.chefs();

        const chefs = results.rows.map(chef => ({
            ...chef,
            file_src: `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`
        }));

        return res.render('website/chefs', { chefs });
    },
    // Pesquisar receita
    search(req, res) {
        let { filter } = req.query;

        const params = {
            filter,

            callback(recipes) {
                return res.render('website/pesquisa', { recipes, filter });
            }
        }

        Website.search(params);
    }
};