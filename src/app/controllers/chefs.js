// Importa o modelo
const Chef = require('../models/Chef');

module.exports = {
    // Página inicial do admin
    index(req, res) {
        Chef.index(function (chefs) {
            return res.render('admin/chefs/index', { chefs });
        });
    },
    // Página para cadastro de receita
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    // Cadastra chef
    post(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Chef.create(req.body, function (chef) {
            return res.redirect(`/admin/chefs/${chef.id}`);
        });
    },
    // Mostra chef
    show(req, res) {
        Chef.find(req.params.id, function (chef) {
            if (!chef) {
                return res.send('Chef não foi encontrado.');
            }

            Chef.findRecipe(req.params.id, function (recipes) {
                res.render("admin/chefs/show", { chef, recipes });
            })
        });
    },
    // Página para editar receita
    edit(req, res) {
        Chef.find(req.params.id, function (chef) {
            // Se não tiver um instrutor
            if (!chef) {
                return res.send('Chef não foi encontrado.');
            }

            return res.render('admin/chefs/edit', { chef });
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

        Chef.update(req.body, function () {
            return res.redirect(`/admin/chefs/${req.body.id}`);
        });
    },
    // Deleta receita
    delete(req, res) {
        const { id } = req.body;

        Chef.checkChefHasRecipe(id, function (count) {
            if (count > 0) {
                return res.send("Chef que possui receita não pode ser deletado.");
            } else {
                Chef.delete(req.body.id, function () {
                    return res.redirect('/admin/chefs');
                });
            }
        });
    }
};