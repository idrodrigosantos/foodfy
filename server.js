// Importa os pacotes
const express = require('express');
const nunjucks = require('nunjucks');

// Importa o arquivo data.js
const recipes = require('./data');

// Cria o servidor
const server = express();

// Para usar arquivos estáticos
server.use(express.static('public'));

// Configuração do nunjucks
server.set('view engine', 'njk');
nunjucks.configure('views', {
    express: server,
    // Não faz cache no navegador
    noCache: true
});

// Rotas
server.get('/', function (req, res) {
    return res.render('index', { items: recipes });
});

server.get('/receitas', function (req, res) {
    return res.render('receitas', { items: recipes });
});

server.get("/receitas/:index", function (req, res) {
    const recipeIndex = req.params.index;
    const recipe = recipes[recipeIndex];

    return res.render("receita", { recipe })
})

server.get('/sobre', function (req, res) {
    return res.render('sobre');
});

// Inicia o servidor na porta 5000
server.listen(5000, function () {
    console.log('Server is running.')
});