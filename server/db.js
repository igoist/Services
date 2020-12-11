const config = require('./config');
const Sequelize = require('sequelize');

let sequelizeInst = null;

const modelTable = ['item', 'zhihuItem', 'linkItem', 'linkType'];

const loadModel = (sequelize) => {
  return (name) => {
    const modelConf = require(`./models/${name}`);

    const model = sequelize.define(name, modelConf, {
      timestamps: true,
      paranoid: true
    });

    if (config.env !== 'production') {
      // return model.sync({ alter: true });
      return model.sync();
    }
  };
};

const loadModels = (sequelize) => {
  return Promise.all(modelTable.map(loadModel(sequelize)));
};

// init Sequelize & define models
const init = () => {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    timezone: '+08:00',
    // pool: {
    //   max: 5,
    //   min: 0,
    //   idle: 30000
    // }
    logging: false
  });

  sequelizeInst = sequelize;

  exports.sequelizeInst = sequelizeInst;

  return loadModels(sequelize);
};

exports.init = init;
// exports.sequelizeInst = sequelizeInst; // 無駄
