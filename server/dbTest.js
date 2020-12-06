const config = require('./config');
const Sequelize = require('sequelize');

const zhihu = require('./v1/zhihu');

let sequelizeInst = null;

// const modelTable = ['item'];
const modelTable = ['item', 'zhihuItem'];

const loadModel = (sequelize) => {
  return (name) => {
    const modelConf = require(`./models/${name}`);

    const model = sequelize.define(name, modelConf, {
      timestamps: true
    });

    console.log('model: ', typeof model);

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
    timezone: '+08:00'
  });

  sequelizeInst = sequelize;

  exports.sequelizeInst = sequelizeInst;

  return loadModels(sequelize);
};

const testMethods = (Item) => {
  const findOne = async (title) => {
    const item = await Item.findOne({ where: { title } });
    if (item === null) {
      console.log('Not found!');
    } else {
      console.log(item instanceof Item); // true
      console.log(item.title); // 'My Title'
    }
    return item;
  };

  const updateSingleOne = async () => {
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
  };

  return { findOne, updateSingleOne };
};

const migrateZhihuItems = (MM) => {
  let Item = sequelizeInst.model('item');
  // const { findOne } = testMethods(Item);
  let x = await Item.findAll();


  for (let i = 0; i < x.length; i++) {
    let item = x[i].dataValues;
    delete item.id;

    const [a, created] = await MM.findOrCreate({
      where: { title: item.title },
      defaults: {
        ...item
      }
    });
    if (created) {
      console.log(`create${i} - ${item.title}`);
    } else {
      console.log(`read${i} - ${item.title}`);
    }
  }
  return;
}

const test = async () => {
  try {
    await init(config);


    let MM = sequelizeInst.model('zhihuItem');
    // migrateZhihuItems(MM);

    const { findOne } = testMethods(MM);

    console.time('dbTest');
    const data = await zhihu.getZhihuData(true);
    // await findOne('如何评价《英雄联盟》新英雄「含羞蓓蕾」莉莉娅？');
    // console.log(data.slice(0, 2));

    const tmp = data.slice(0, 5);
    let f = false;
    for (let i = 0; i < tmp.length; i++) {
      let item = tmp[i];
      // let r = await findOne(item.title);
      // if (!r) {
      //   console.log('enter ', i, r);

      // }
      if (f) {
        console.log(`${i} - ${item.title}`);
        continue;
      }

      const [a, b] = await MM.findOrCreate({
        where: { title: item.title },
        defaults: {
          ...item
        }
      });

      console.log(`${i}: `, a, b);
      if (b) {
        // break;
        f = true;
      }
    }

    console.timeEnd('dbTest');

    // await sequelizeInst.authenticate();

    // console.log('Connection has been established successfully.');

    // findAll(r[0]);
    // console.log(Object.keys(r[0]), r[0].findAll, typeof r[0].findAll);
    // console.log(JSON.stringify(r[0], null, 2));
    // console.log(Object.keys(r[0]), r[0].findAll, typeof r[0].findAll);
  } finally {
    sequelizeInst.close();
  }
};

test();
