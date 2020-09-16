// Importa os modelos
const Chef = require('../models/Chef');
const File = require('../models/File');
const ChefFile = require('../models/ChefFile');

module.exports = {
    // Mostra todos os chefs
    async index(req, res) {
        try {
            user = req.session.userId;

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

            const { error, success } = req.session;
            req.session.error = '';
            req.session.success = '';

            return res.render('admin/chefs/index', { chefs, pagination, error, success });
        } catch (error) {
            console.error(error);
        }
    },
    // Página para cadastro de chef
    create(req, res) {
        const { error } = req.session;
        req.session.error = '';

        return res.render('admin/chefs/create', { error });
    },
    // Cadastra chef
    async post(req, res) {
        try {
            const keys = Object.keys(req.body);

            for (key of keys) {
                if (req.body[key] == '') {
                    // return res.send('Por favor, preencha todos os campos.');

                    req.session.error = 'Por favor, preencha todos os campos.';
                    return res.redirect('/admin/chefs/create');
                }
            }

            if (req.files.length == 0) {
                // return res.send('Por favor, envie pelo menos uma imagem.');

                req.session.error = 'Por favor, envie pelo menos uma imagem.';
                return res.redirect('/admin/chefs/create');
            }

            const data = {
                ...req.body,
            }

            const results = await Chef.create(data);

            const chef_id = results.rows[0].id;

            const filesPromise = req.files.map(async file => {
                const results = await File.create(file);
                const file_id = results.rows[0].id;
                const chefFile = {
                    file_id,
                    chef_id
                }

                await ChefFile.create(chefFile);
            });

            await Promise.all(filesPromise);

            req.session.success = 'Chef criado com sucesso.';
            return res.redirect('/admin/chefs');
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

            results = await Chef.files(id);

            const file = {
                ...results.rows[0],
                src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', '')}`
            }

            results = await Chef.findRecipesByChefId(chef.id);

            const recipes = results.rows.map(recipe => ({
                ...recipe,
                file_path: `${req.protocol}://${req.headers.host}${recipe.file_path.replace('public', '')}`
            }));

            const { success } = req.session;
            req.session.success = '';

            return res.render('admin/chefs/show', { chef, recipes, file, success });
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

            if (!chef) {
                return res.send('Chef não foi encontrado.');
            }

            results = await Chef.files(id);

            const file = {
                ...results.rows[0],
                src: `${req.protocol}://${req.headers.host}${results.rows[0].path.replace('public', '')}`
            }

            const { error } = req.session;
            req.session.error = '';

            return res.render('admin/chefs/edit', { chef, file, error });
        } catch (error) {
            console.error(error);
        }
    },
    // Salva alterações do cadastro do chef
    async put(req, res) {
        try {
            const keys = Object.keys(req.body);

            const { id: chef_id } = req.body;

            for (key of keys) {
                if (req.body[key] == '' && key != 'removed_files') {
                    // return res.send('Por favor, preencha todos os campos.');

                    req.session.error = 'Por favor, preencha todos os campos.';
                    return res.redirect(`/admin/chefs/${req.body.id}/edit`);
                }
            }

            if (req.files.length != 0) {
                const filesPromise = req.files.map(async file => {
                    const results = await File.create(file);
                    const file_id = results.rows[0].id;
                    const chefFile = {
                        file_id,
                        chef_id
                    }

                    await ChefFile.create(chefFile);
                });

                await Promise.all(filesPromise);
            }

            if (req.body.removed_files) {
                const removedFiles = req.body.removed_files.split(',');

                const lastIndex = removedFiles.length - 1;

                removedFiles.splice(lastIndex, 1);

                const removedFilesPromise = removedFiles.map(async id => {
                    await ChefFile.delete({
                        file_id: id,
                        chef_id,
                    });

                    await File.delete(id);
                });

                await Promise.all(removedFilesPromise);
            }

            await Chef.update(req.body);

            req.session.success = 'Chef atualizado com sucesso.';
            return res.redirect(`/admin/chefs/${req.body.id}`);
        } catch (error) {
            console.error(error);
        }
    },
    // Deleta chef    
    async delete(req, res) {
        try {
            const { id } = req.body;

            let results = await Chef.files(id);

            const filesPromise = results.rows.map(async file => {
                const files = {
                    file_id: file.id,
                    chef_id: id
                }

                await ChefFile.delete(files);

                await File.delete(file.id);
            });

            Promise.all(filesPromise);

            await Chef.delete(id);

            req.session.success = 'Chef deletado com sucesso.';
            return res.redirect('/admin/chefs');
        } catch (error) {
            console.error(error);
        }
    }
};