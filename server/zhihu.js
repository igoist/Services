const log = console.log.bind(this);

const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const utils = require('./utils');

const { readFile, writeFile, guaranteeDirExist } = utils.file;

let time;
let tmpTS;

const handleDate = () => {
  let y = time.getYear() + 1900;
  let m = time.getMonth() + 1;
  let d = time.getDate();

  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }

  return `${y}-${m}-${d}`;
};

const dirName = '../tmps';
const dirName2 = '../data';

let fileName;
let fileName2;

const updateTime = () => {
  time = new Date();
  tmpTS = +time;
  fileName = path.resolve(__dirname, `${dirName}/tmp-${tmpTS}.html`);
  fileName2 = path.resolve(__dirname, `${dirName2}/data-${handleDate()}.json`);
};

const getData = () => {
  let uri = 'https://www.zhihu.com/billboard';

  return new Promise((resolve) => {
    request(
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
          'Content-Type': 'text/html; charset=utf-8'
        },
        uri,
        method: 'GET'
      },
      function (error, response, body) {
        if (error) {
          log('here error: ', error);
        }
        resolve(body);
      }
    );
  });
};

const handleData = (data) => {
  let objs = [];
  let $ = cheerio.load(data);

  let el = $('script#js-initialData')[0];
  let obj = JSON.parse(el.children[0].data);
  let hotList = obj.initialState.topstory.hotList;
  hotList.map((item, i) => {
    let t = item.target;
    let title = t.titleArea.text;
    let excerpt = t.excerptArea.text;
    let link = t['link']['url'];
    let img = t['imageArea']['url'];

    objs.push({
      title,
      excerpt,
      link,
      img
    });
  });

  return objs;
};

const handleFile = (fileName, resultName) => {
  return new Promise(async (resolve) => {
    let fileData = await readFile(fileName, 'utf8');

    // we should reset objs every time
    let objs = handleData(fileData);

    let tmpFileName = resultName || 'data/test.json';

    let res = await writeFile(tmpFileName, JSON.stringify(objs, null, 2));
    resolve(res);
  });
};

/**
 *
 */
const getZhihuData = async (incognito = false) => {
  let res = await getData();

  if (incognito) {
    let result = handleData(res);

    return result;
  }

  await guaranteeDirExist(path.resolve(__dirname, dirName));

  let ifWriteSuccess = await writeFile(fileName, res);
  if (!ifWriteSuccess) {
    return false;
  }

  await guaranteeDirExist(path.resolve(__dirname, dirName2));

  let ifHandleSuccess = await handleFile(fileName, fileName2);
  if (!ifHandleSuccess) {
    return false;
  }

  return true;
};

/**
 * mode case:
 * 0 - the old, with cache
 * 1 - latest with storage
 * 2 - latest without storage
 */
const getZhihuDataForApi = async (mode = 0) => {
  if (mode === 2) {
    return await getZhihuData(true);
  }

  /**
   * except mode 2, update time first
   */
  updateTime();

  let fileData;

  if (mode === 0) {
    fileData = await readFile(fileName2, 'utf8');
  }

  if (mode === 1 || !fileData) {
    let ifGet = await getZhihuData();

    if (!ifGet) {
      return [];
    }

    fileData = await readFile(fileName2, 'utf8');
  }

  return JSON.parse(fileData);
};

exports.getZhihuData = getZhihuData;
exports.getZhihuDataForApi = getZhihuDataForApi;

// getZhihuData(true);
// (async () => {
//   let r = await getZhihuDataForApi(2);
//   console.log(r);
// })();
