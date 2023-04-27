const Sequelize = require('sequelize');
const connection = require('../DB/db');

const Users = connection.define('users',{  
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    
        email: {
            type: Sequelize.STRING,
            allowNull: false
    
        },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
    });
    
    module.exports = Users;
   