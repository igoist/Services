const db = require('../db');

exports.registerArr = [
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
          const LinkType = se.model('linkType');

          let defaults = {
            name,
            sort
          };

          const [item, created] = await LinkType.findOrCreate({
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
          const M = se.model('linkItem');

          let defaults = {
            title,
            link,
            excerpt,
            typeIds
          };

          if (createdAt) {
            defaults.createdAt = createdAt;
          }

          const [item, created] = await M.findOrCreate({
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
