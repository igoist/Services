const Sequelize = require('sequelize');

var Item = {
    title: Sequelize.STRING(100),
    link: Sequelize.STRING(300),
    img: Sequelize.STRING(100),
    excerpt: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    extra: {
      type: Sequelize.TEXT,
      allowNull: true
    },
};

module.exports = Item;
