// Importa o modelo
const Home = require('../models/Home');

module.exports = {
    // Index
    async index(req, res) {
        const results = await Home.index();

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        return res.render('home/index', { recipes });
    },
    // Sobre
    about(req, res) {
        return res.render('home/sobre');
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

        const results = await Home.paginate(params);

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        const pagination = {
            total: recipes[0] ? Math.ceil(recipes[0].total / limit) : 0,
            page,
            filter
        }

        return res.render('home/receitas', { recipes, pagination });
    },
    // Receita individual
    async recipe(req, res) {
        const { id } = req.params;

        let results = await Home.find(id);

        const recipe = results.rows[0];

        results = await Home.files(id);

        const files = results.rows.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }));

        if (!recipe) {
            return res.send('Receita não foi encontrada.');
        }

        return res.render('home/receita', { recipe, files });
    },
    // Chefs
    async chefs(req, res) {
        const results = await Home.chefs();

        const chefs = results.rows.map(chef => ({
            ...chef,
            file_src: `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`
        }));

        return res.render('home/chefs', { chefs });
    },
    // Pesquisar receita
    async search(req, res) {
        let { filter } = req.query;

        const params = {
            filter
        }

        const results = await Home.search(params);

        const recipes = results.rows.map(recipe => ({
            ...recipe,
            file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
        }));

        return res.render('home/pesquisa', { recipes, filter });
    }
};