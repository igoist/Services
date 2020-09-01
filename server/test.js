const log = console.log.bind(this);

const zhihu = require('./zhihu');

const { getZhihuDataForApi } = zhihu;

let test = async () => {
  result = await getZhihuDataForApi();

  // console.log('===========', typeof result, result.length);

  for (i = 0; i < result.length; i++) {
    log(`${i < 10 ? '0' + i : i}: ${result[i].title}`);
  }
};

test();
