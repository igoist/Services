const db = require('../db');

/**
 * get, post, put, delete
 */
const LinkTypeArr = [
  {
    method: 'get',
    api: '/api/v1/item/type/',
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
    api: '/api/v1/item/type/',
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
  },
  {
    method: 'put',
    api: '/api/v1/item/type/:id',
    f: () => {
      return async (ctx) => {
        let { id } = ctx.params;
        console.log(`/api/v1/item/type/${id}: `, ctx.request.body);

        let Code = 0;
        let msg = '';

        id = parseInt(id);

        if (id !== NaN && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkType');

          let old = await MM.findByPk(id);
          if (old) {
            msg = 'find & update';
          }
          console.log('old: ', old);
          console.log('new: ', ctx.request.body);
        }

        ctx.body = {
          Code,
          msg
        };
      };
    }
  },
  {
    method: 'delete',
    api: '/api/v1/item/type/:id/',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/type/delete: ', ctx.params);
        let { id } = ctx.params;

        let Code = 0;
        let msg = '';

        id = parseInt(id);

        if (id !== NaN && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkType');

          const item = await MM.findByPk(id);

          if (item !== null) {
            msg = `id ${id} found! So delete it`;
            let tmp = await MM.destroy({
              where: { id }
            });

            // Q: why tmp is 1 ?
            // console.log('tmp', tmp);
          } else {
            msg = `id ${id} not found...`;
            Code = 666;
          }
          console.log(msg);
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
    api: '/api/v1/item/',
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
    api: '/api/v1/item/',
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
  },
  {
    method: 'put',
    api: '/api/v1/item/',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/list: ', ctx.request.body);
        let { id } = ctx.request.body;

        let Code = 0;
        let msg = '';

        id = parseInt(id);

        if (id !== NaN && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkItem');

          let old = await MM.findByPk(id);
          if (old) {
            msg = 'find & update';
          }
          console.log('old: ', old);
          console.log('new: ', ctx.request.body);
        }

        ctx.body = {
          Code,
          msg
        };
      };
    }
  },
  {
    method: 'delete',
    api: '/api/v1/item/:id/',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/delete: ', ctx.params);
        let { id } = ctx.params;

        let Code = 0;
        let msg = '';

        id = parseInt(id);
        if (id !== NaN && db.sequelizeInst) {
          const se = db.sequelizeInst;
          const MM = se.model('linkItem');

          const item = await MM.findByPk(id);

          if (item !== null) {
            msg = `id ${id} found! So delete it`;
            await MM.destroy({
              where: { id }
            });
          } else {
            msg = `id ${id} not found...`;
            Code = 666;
          }
          console.log(msg);
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
