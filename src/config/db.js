// Conexão com o banco de dados

// Pool: é a configuração que faz o login, 
// asssim não precisa usar login e senha todas as
// vezes que for fazer querys
const { Pool } = require('pg');

module.exports = new Pool({
    // user: 'Usuário PostgreSQL',
    // password: 'Senha PostgreSQL',    
    host: 'localhost',
    port: 5432,
    database: 'foodfy'
});