const moment = require('moment');

exports.log = async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  const m = moment();
  console.log(`${ctx.method} ${ctx.url} - ${rt} - ${m.format('YYYY MM DD（dddd）HH:mm:ss -- x')}`);
};

// x-response-time
exports.XResponseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
};
