// Importa os modelos
const Chef = require('../models/Chef');
const File = require('../models/File');

module.exports = {
    // Mostra todos os chefs
    async index(req, res) {
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

            return res.render('admin/chefs/index', { chefs, pagination });
        } catch (error) {
            console.error(error);
        }
    },
    // Página para cadastro de chef
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    // Cadastra chef
    async post(req, res) {
        try {
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

            // const chefId = results.rows[0].id;
            // return res.redirect(`/admin/chefs/${chefId}`);

            return res.render('admin/chefs/create', {
                success: 'Chef criado com sucesso.',
            });
        } catch (error) {
            console.error(error);
        }
    },
    // Mostra chef
    async show(req, res) {
        try {
            const { id } = req.params;

            let results = await Chef.find(id);

            const chef = results.rows[0];

            results = await Chef.files(chef.file_id);

            const file = {
                ...results.rows[0],
                src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', '')}`
            }

            results = await Chef.findRecipesByChefId(chef.id);

            const recipes = results.rows.map(recipe => ({
                ...recipe,
                file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
            }));

            return res.render('admin/chefs/show', { chef, recipes, file });
        } catch (error) {
            console.error(error);
        }
    },
    // Página para editar chef
    async edit(req, res) {
        try {
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
        } catch (error) {
            console.error(error);
        }
    },
    // Salva alterações do cadastro do chef
    async put(req, res) {
        try {
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

            // return res.redirect(`/admin/chefs/${req.body.id}`);

            return res.render('admin/chefs/edit', {
                success: 'Chef atualizado com sucesso.',
            });
        } catch (error) {
            console.error(error);
        }
    },
    // Deleta chef    
    async delete(req, res) {
        try {
            const { id } = req.body;

            await Chef.delete(id);

            // return res.redirect(`/admin/chefs`);

            return res.render('admin/chefs/edit', {
                success: 'Chef deletado com sucesso.',
            });
        } catch (error) {
            console.error(error);
        }
    }
};