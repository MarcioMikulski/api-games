 const Sequelize = require('sequelize');
const connection = require('../DB/db');

const Games = connection.define('jogos',{  
title: {
	type: Sequelize.STRING,
	allowNull: false
},

    year: {
        type: Sequelize.NUMBER,
        allowNull: false

    },
price: {

	type: Sequelize.DOUBLE,
    allowNull: false
}
})

//Games.sync({force: false}).then(() => {});

module.exports = Games; 