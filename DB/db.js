const Sequelize = require('sequelize');
const connection = new Sequelize('games', 'root', 'Gozo!@34', {
    host: 'localhost',
    dialect: 'mysql'
    
});

module.exports = connection;