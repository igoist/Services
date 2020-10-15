const Koa = require('koa');
const Router = require('koa-router');
const Cors = require('koa-cors');
const zhihu = require('./v1/zhihu');
const renting = require('./v1/renting');
const v2ex = require('./v1/v2ex');

const { info, intercept } = require('./middleware');

const app = new Koa();
const router = new Router();
const port = 6085;

router.get('/', async (ctx) => {
  ctx.body = {
    Code: 0,
    Data: tmpArr
  };
});

/**
 * zhihu
 * douban renting
 * v2ex
 */
router.get('/api/v1/list/:id', zhihu.getZhihuDataForAPI());

router.get('/api/v1/list/:id/latest', zhihu.getZhihuDataForAPI(1));

router.get('/api/v1/list/:id/incognito', zhihu.getZhihuDataForAPI(2));

router.get('/api/v1/renting/:id', renting.getRentingDataForAPI());

router.get('/api/v1/v2ex/nodes', v2ex.getDataForAPI(0));

router.get('/api/v1/v2ex/node/:id', v2ex.getDataForAPI(1));

router.get('/api/v1/v2ex/hot', v2ex.getDataForAPI(2));

app.use(Cors());

// 限流
app.use(intercept.common());

// log info
app.use(info.log);

// x-response-time
app.use(info.XResponseTime);

app.use(router.routes());

app.on('error', (err) => {
  // log.error('server error', err);
  console.log('err: ', err);
});

app.listen(port);
