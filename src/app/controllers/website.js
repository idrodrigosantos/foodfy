// Importa o modelo
const Website = require('../models/Website');

module.exports = {
    // Index
    index(req, res) {
        Website.all(function (recipes) {
            return res.render('website/index', { recipes });
        });
    },
    // Sobre
    about(req, res) {
        return res.render('website/sobre');
    },
    // Receitas
    recipes(req, res) {
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 9;
        let offset = limit * (page - 1);

        const params = {
            page,
            limit,
            offset,
            callback(recipes) {
                const pagination = {
                    // ceil arredonda o cálculo para cima
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render('website/receitas', { recipes, pagination });
            }
        }

        Website.paginate(params);
    },
    // Receita individual
    recipe(req, res) {
        Website.recipe(req.params.id, function (recipe) {
            if (!recipe) {
                return res.send('Receita não foi encontrada.');
            }
            return res.render('website/receita', { recipe });
        });
    },
    // Chefs
    chefs(req, res) {
        Website.chefs(function (chefs) {
            return res.render('website/chefs', { chefs });
        });
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