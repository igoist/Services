const config = require('./config');
const Sequelize = require('sequelize');
// const Billboard = require('./models/billboard');

// const zhihu = require('./v1/zhihu');

let sequelizeInst = null;

const modelTable = ['billboard', 'item'];

const loadModel = (sequelize) => {
  return (name) => {
    const modelConf = require(`./models/${name}`);

    const model = sequelize.define(name, modelConf, {
      timestamps: true
    });

    console.log('model: ', typeof model);

    if (config.env !== 'production') {
      // return model.sync({ alter: true });
      // return model.sync();
    }
  };
};

const loadModels = (sequelize) => {
  return Promise.all(modelTable.map(loadModel(sequelize)));
};

// init Sequelize & define models
const init = (config) => {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    // logging: false
    timezone: '+08:00'
    // pool: {
    //   max: 5,
    //   min: 0,
    //   idle: 30000
    // }
  });

  sequelizeInst = sequelize;

  exports.sequelize = sequelize;

  return loadModels(sequelize);
};

const test = async () => {
  const saveData = () => {
    return new Promise(async (resolve) => {
      // let data = await zhihu.getZhihuDataForApi();
      // console.log(typeof data, data.length);
      // for (let i = 0; i < data.length; i++) {
      //   // console.log(data[i].title);
      //   let r = await Item.create({
      //     title: data[i].title,
      //     excerpt: data[i].excerpt,
      //     link: data[i].link,
      //     img: data[i].img
      //   });
      //   console.log('created: ' + JSON.stringify(r));
      // }

      // await Billboard.create({
      //   list: JSON.stringify(data)
      // });

      resolve(true);
    });
  };

  try {
    let x = await init(config);

    // let r = sequelizeInst.model('billboard');
    let Item = sequelizeInst.model('item');

    await Item.update(
      { createdAt: '2020-12-04 21:49:00' },
      {
        where: {
          id: {
            [Sequelize.Op.lt]: 200
          }
        }
      }
    );

    await sequelizeInst.authenticate();

    console.log('Connection has been established successfully.');

    // findAll(r[0]);
    // console.log(Object.keys(r[0]), r[0].findAll, typeof r[0].findAll);
    // console.log(JSON.stringify(r[0], null, 2));
    // console.log(Object.keys(r[0]), r[0].findAll, typeof r[0].findAll);
  } finally {
    // sequelize.close();
  }
};

test();

exports.init = init;
