const Sequelize = require('sequelize');

exports.I = Sequelize.INTEGER;
exports.S = (n) => Sequelize.STRING(n);
exports.T = Sequelize.TEXT;
