const db = require('../db');
const Sequelize = require('sequelize');
const { Op } = Sequelize;

/**
 * get, post, put, delete
 */
const HistoryItemArr = [
  {
    method: 'get',
    api: '/api/v1/item/history/',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/history/list: ', ctx.request.body, ctx.query);
        let page = 1;
        let limit = 10;

        if (ctx.query.page !== undefined) {
          page = parseInt(ctx.query.page);
        }

        if (ctx.query.limit !== undefined) {
          limit = parseInt(ctx.query.limit);
        }

        let Code = 0;
        let list = [];

        const se = db.sequelizeInst;
        if (se) {
          const MM = se.model('historyItem');

          let where = {};

          if (ctx.query.title !== undefined) {
            where = {
              title: {
                [Op.like]: `%${ctx.query.title}%`
              }
            };
          }

          const clause = {
            where,
            order: [['id', 'desc']],
            offset: (page - 1) * limit,
            limit
          };

          let result = await MM.findAndCountAll(clause);

          count = result.count;
          list = result.rows;
        }

        ctx.body = {
          Code,
          list,
          count
        };
      };
    }
  },
  {
    method: 'post',
    api: '/api/v1/item/history/',
    f: () => {
      return async (ctx) => {
        const b = ctx.request.body;
        const { title, link, excerpt, typeIds, generatedId, isDeleted, createdAt } = b;
        console.log('/api/v1/item/history/add: ', b);

        let Code = 0;
        let msg = '';

        const se = db.sequelizeInst;

        if (title && se) {
          const MM = se.model('historyItem');

          let defaults = {
            title,
            link,
            excerpt,
            typeIds,
            generatedId
          };

          if (isDeleted) {
            defaults.isDeleted = isDeleted;
          }

          if (createdAt) {
            defaults.createdAt = createdAt;
          }

          const [item, created] = await MM.findOrCreate({
            where: { generatedId },
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
    api: '/api/v1/item/history/:id',
    f: () => {
      return async (ctx) => {
        let { id } = ctx.params;
        console.log('/api/v1/item/history/list: ', ctx.request.body);

        let Code = 0;
        let msg = '';

        id = parseInt(id);
        const se = db.sequelizeInst;

        if (id !== NaN && se) {
          const MM = se.model('historyItem');

          let old = await MM.findByPk(id);
          if (old) {
            MM.update(
              { ...ctx.request.body },
              {
                where: {
                  id
                }
              }
            );
            msg = 'find & update';
          }
          console.log('old: ', old && old.title);
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
    api: '/api/v1/item/history/:id/',
    f: () => {
      return async (ctx) => {
        console.log('/api/v1/item/history/delete: ', ctx.params);
        let { id } = ctx.params;

        let Code = 0;
        let msg = '';

        id = parseInt(id);
        const se = db.sequelizeInst;

        if (id !== NaN && se) {
          const MM = se.model('historyItem');

          const item = await MM.findByPk(id);

          if (item !== null) {
            msg = `id ${id} found! So delete it`;
            // await MM.destroy({
            //   where: { id }
            // });
            // 这里设置 isDeleted 即可
            MM.update(
              { isDeleted: true },
              {
                where: {
                  id
                }
              }
            );
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

exports.registerArr = [...HistoryItemArr];
