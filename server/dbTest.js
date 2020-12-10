const config = require('./config');
const Sequelize = require('sequelize');
const zhihu = require('./v1/zhihu');

const { Op } = Sequelize;

const modelTable = ['item', 'zhihuItem', 'linkItem', 'linkType'];
let sequelizeInst = null;

const loadModel = (sequelize) => {
  return (name) => {
    const modelConf = require(`./models/${name}`);

    const model = sequelize.define(name, modelConf, {
      timestamps: true,
      paranoid: true
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
    timezone: '+08:00',
    logging: false
  });

  sequelizeInst = sequelize;

  exports.sequelizeInst = sequelizeInst;

  return loadModels(sequelize);
};

// const testMethods = (TItem) => {
//   const findOne = async (option) => {
//     const item = await TItem.findOne({ where: option });
//     if (item === null) {
//       console.log('Not found!');
//     } else {
//       console.log(item instanceof TItem); // true
//       console.log(item.title); // 'My Title'
//     }
//     return item;
//   };

//   const updateSingleOne = async () => {
//     await Item.update(
//       { createdAt: '2020-12-04 21:49:00' },
//       {
//         where: {
//           id: {
//             [Sequelize.Op.lt]: 200
//           }
//         }
//       }
//     );
//   };

//   return { findOne, updateSingleOne };
// };

const test = async () => {
  try {
    // await init(config);
    // await case0001();
    // await case0002();
    // await sequelizeInst.authenticate();
    // console.log('Connection has been established successfully.');
  } finally {
    sequelizeInst.close();
  }
};

test();

const migrateZhihuItems = async (MM) => {
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
};

// 迁移、CR 测试
const case0000 = async () => {
  // migrateZhihuItems(MM);

  console.time('dbTest');
  let MM = sequelizeInst.model('zhihuItem');
  const { findOne } = testMethods(MM);
  const data = await zhihu.getZhihuData(true);
  // await findOne('如何评价《英雄联盟》新英雄「含羞蓓蕾」莉莉娅？');
  // console.log(data.slice(0, 2));

  const tmp = data.slice(0, 25);
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

    if (b) {
      // break;
      f = true;
      console.log(`${i}: `, a.title, b);
    }
  }

  console.timeEnd('dbTest');
};

// zhihuItem 根据关键字搜索
const case0001 = async () => {
  let MM = sequelizeInst.model('zhihuItem');

  let a = await MM.findAll({
    where: {
      title: {
        [Op.like]: '%微%'
      }
    }
  });

  for (let i = 0; i < a.length; i++) {
    console.log(a[i].title, a[i].link);
  }
};

// 关联表测试
const case0002 = async () => {
  const { I, S, T } = require('./ModelType');
  const sq = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    timezone: '+08:00',
    logging: false
  });
  sequelizeInst = sq;
  console.log('1111111111', sequelizeInst);

  const A = sq.define(
    'aa',
    {
      name: S(100)
    },
    {
      timestamps: false
    }
  );

  const B = sq.define(
    'bb',
    {
      name: S(100)
    },
    {
      timestamps: false
    }
  );

  A.B = A.hasMany(B, { as: 'b' });
  // A.B = A.hasMany(B);
  // B.belongsTo(A);

  await B.drop();
  await A.drop();
  return;
  // A.sync();
  // B.sync();
  // await sq.sync({ alter: true });
  await sq.sync();

  a1 = ['a0', 'a1', 'a2', 'a3'];
  b1 = ['b1', 'b2', 'b3'];

  for (let i = 0; i < b1.length; i++) {
    await B.findOrCreate({
      where: { name: b1[i] },
      defaults: {
        name: b1[i]
      }
    });
  }

  for (let i = 0; i < a1.length; i++) {
    if (i < 100) {
      await A.create(
        {
          name: a1[i],
          // bbs: [{ name: 'b998' }, { name: 'b999' }]
          // b: [
          //   {
          //     name: 'b998'
          //   },
          //   {
          //     name: 'b999'
          //   }
          // ]
          b: {
            name: 'b996'
          }
        },
        {
          include: A.B,
          as: 'b'
        }
      );
    } else {
      await A.findOrCreate({
        where: { name: a1[i] },
        defaults: {
          name: a1[i]
        }
      });
    }
  }

  const toJ = (o) => {
    console.log('****************');
    console.log(JSON.stringify(o, null, 2));
    console.log('****************\n');
  };

  r1 = await B.findAll({});

  toJ(r1);

  r2 = await A.findAll({
    include: B
  });

  toJ(r2);
};

//
const case0003 = async () => {
  r = await init();

  const [a, b, c, d] = r;

  o = {
    title: 'Node.js Sequelize 模型(表)之间的关联及关系模型的操作',
    link: 'https://itbilu.com/nodejs/npm/EJarwPD8W.html'
  };

  await c.findOrCreate({
    where: {
      title: o.title
    },
    defaults: o
  });

  // console.log(b);
  // console.log(b.hasOne);
  // console.log(b.hasMany);
  // console.log(b.belongsTo);
  // console.log(b.belongsToMany);
  sequelizeInst.close();
};
