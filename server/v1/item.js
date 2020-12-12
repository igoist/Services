const db = require('../db');

const LinkTypeArr = [
  {
    method: 'get',
    api: '/api/v1/item/type/list',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/type/list: ', ctx.request.body);
        let Code = 0;
        let list = [];

        if (db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkType');

          list = await MM.findAll();
        }

        ctx.body = {
          Code,
          list
        };
      };
    }
  },
  {
    method: 'post',
    api: '/api/v1/item/type/add',
    f: () => {
      return async (ctx) => {
        const { name, sort = 0 } = ctx.request.body;
        console.log('/api/v1/item/type/add: ', ctx.request.body);
        let Code = 0;
        let msg = '';

        if (name !== undefined && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkType');

          let defaults = {
            name,
            sort
          };

          const [item, created] = await MM.findOrCreate({
            where: { name },
            defaults
          });

          if (created) {
            msg = 'add success!';
          } else {
            msg = 'already exist';
          }
        }

        ctx.body = {
          Code,
          msg
        };
      };
    }
  }
];

const LinkArr = [
  {
    method: 'get',
    api: '/api/v1/item/list',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/list: ', ctx.request.body);
        let Code = 0;
        let list = [];

        if (db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkItem');

          list = await MM.findAll();
        }

        ctx.body = {
          Code,
          list
        };
      };
    }
  },
  {
    method: 'post',
    api: '/api/v1/item/add',
    f: () => {
      return async (ctx) => {
        const b = ctx.request.body;
        const { title, link, excerpt, typeIds, createdAt } = b;

        let Code = 0;
        let msg = '';

        console.log('/api/v1/item/add: ', b);
        if (title && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkItem');

          let defaults = {
            title,
            link,
            excerpt,
            typeIds
          };

          if (createdAt) {
            defaults.createdAt = createdAt;
          }

          const [item, created] = await MM.findOrCreate({
            where: { title },
            defaults
          });

          if (created) {
            msg = 'add success!';
          } else {
            msg = 'already exist';
          }
        }

        ctx.body = {
          Code,
          msg
        };
      };
    }
  }
];

exports.registerArr = [...LinkTypeArr, ...LinkArr];
