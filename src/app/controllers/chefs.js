// Importa os modelos
const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    // Página inicial do admin
    async index(req, res) {
        const results = await Chef.index();

        const chefs = [];

        for (let chef of results.rows) {
            chef = {
                ...chef,
                file_src: `${req.protocol}://${req.headers.host}${chef.file_path.replace('public', '')}`
            }

            chefs.push(chef);
        }

        return res.render('admin/chefs/index', { chefs });
    },
    // Página para cadastro de receita
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    // Cadastra chef
    async post(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        if (req.files.length == 0) {
            return res.send('Por favor, envie pelo menos uma imagem.');
        }

        const file = {
            ...req.files[0]
        }

        let results = await File.create(file);

        const file_id = results.rows[0].id;

        const data = {
            ...req.body,
            file_id
        }

        results = await Chef.create(data);

        const chefId = results.rows[0].id;

        return res.redirect(`/admin/chefs/${chefId}`);
    },
    // Mostra chef
    async show(req, res) {
        const { id } = req.params;

        let results = await Chef.find(id);

        const chef = results.rows[0];

        results = await Chef.files(chef.file_id);

        const file = {
            ...results.rows[0],
            src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', '')}`
        }

        results = await Chef.findRecipesByChefId(chef.id);

        const recipes = results.rows;

        return res.render('admin/chefs/show', { chef, recipes, file });
    },
    // Página para editar receita
    async edit(req, res) {
        const { id } = req.params;

        let results = await Chef.find(id);

        const chef = results.rows[0];

        if (!chef) return res.send('Chef não foi encontrado.');

        results = await Chef.files(chef.file_id);

        const file = {
            ...results.rows[0],
            src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', '')}`
        }

        return res.render('admin/chefs/edit', { chef, file });
    },
    // Salva alterações da receita
    async put(req, res) {
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '' && key != 'removed_files') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        let fileId;

        if (req.files.length != 0) {
            const file = {
                ...req.files[0]
            }

            const results = await File.create(file);

            fileId = results.rows[0].id;
        }

        const chef = {
            ...req.body,
            file_id: fileId || req.body.file_id
        }

        await Chef.update(chef);

        if (req.body.removed_files) {
            const removedFile = req.body.removed_files.split(',')[0];

            await File.delete(removedFile);
        }

        return res.redirect(`/admin/chefs/${req.body.id}`);
    },
    // Deleta receita    
    async delete(req, res) {
        const { id } = req.body;

        const recipes = Chef.findRecipesByChefId(id);

        if (!recipes.length) {
            await Chef.delete(id);

            return res.redirect(`/admin/chefs`);
        } else {
            return res.send('Não é possível excluir chefs com receitas registradas.');
        }
    }
};