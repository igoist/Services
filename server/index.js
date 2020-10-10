const log = console.log.bind(this);

const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('koa-cors');
const zhihu = require('./v1/zhihu');
const renting = require('./v1/renting');
const v2ex = require('./v1/v2ex');

const app = new Koa();
const router = new Router();
const port = 6085;

let tmpItem = {
  id: 0,
  title: '知乎'
};
let tmpArr = [];

for (i = 0; i < 20; i++) {
  tmpArr.push(tmpItem);
}

router.get('/', async (ctx) => {
  ctx.body = {
    Code: 0,
    Data: tmpArr
  };
});

/**
 * 俺知道这仨可以用 params 组合到一起
 * 但偏偏就要这样拆开来写！（嚣张.jpg）
 */
router.get('/api/v1/list/:id', async (ctx) => {
  let data = await zhihu.getZhihuDataForAPI();
  // ctx.body = ctx.params;
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/list/:id/latest', async (ctx) => {
  let data = await zhihu.getZhihuDataForAPI(1);
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/list/:id/incognito', async (ctx) => {
  let data = await zhihu.getZhihuDataForAPI(2);
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/renting/:id', async (ctx) => {
  let data = await renting.getRentingDataForAPI();
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/v2ex/nodes', async (ctx) => {
  let data = await v2ex.getNodesDataForAPI();
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/v2ex/node/:id', async (ctx) => {
  let id = parseInt(ctx.params.id);
  let data = await v2ex.getNodesDataForAPI(id);
  ctx.body = {
    Code: 0,
    list: data
  };
});

router.get('/api/v1/v2ex/hot', async (ctx) => {
  let data = await v2ex.getHotDataForAPI();
  ctx.body = {
    Code: 0,
    list: data
  };
});

app.use(Cors());

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());

app.on('error', (err) => {
  // log.error('server error', err);
  console.log('err: ', err);
});

app.listen(port);
