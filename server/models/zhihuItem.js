const Sequelize = require('sequelize');

var ZhihuItem = {
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
  }
};

module.exports = ZhihuItem;
