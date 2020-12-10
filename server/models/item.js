const { S, T } = require('../ModelType');

/**
 * 可能要废弃？
 */

var Item = {
  title: S(100),
  link: S(300),
  img: S(100),
  excerpt: {
    type: T,
    allowNull: true
  },
  extra: {
    type: T,
    allowNull: true
  }
};

module.exports = Item;
