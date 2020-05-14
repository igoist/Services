const log = console.log.bind(this);

const request = require('request');
const cheerio = require('cheerio');
const path = require('path');
const utils = require('./utils');

const { readFile, writeFile } = utils.file;

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

let fileName;
let fileName2;

const updateTime = () => {
  time = new Date();
  tmpTS = +time;
  fileName = path.resolve(__dirname, `../tmps/tmp-${tmpTS}.html`);
  fileName2 = path.resolve(__dirname, `../data/data-${handleDate()}.json`);
};

let getData = () => {
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

const handleFile = (fileName, resultName) => {
  return new Promise(async (resolve) => {
    let fileData = await readFile(fileName, 'utf8');

    // we should reset objs every time
    let objs = [];
    let $ = cheerio.load(fileData);

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

    let tmpFileName = resultName || 'data/test.json';

    let res = await writeFile(tmpFileName, JSON.stringify(objs, null, 2));
    resolve(res);
  });
};

const getZhihuData = async () => {
  let res = await getData();

  let ifWriteSuccess = await writeFile(fileName, res);
  if (!ifWriteSuccess) {
    return false;
  }

  let ifHandleSuccess = await handleFile(fileName, fileName2);
  if (!ifHandleSuccess) {
    return false;
  }

  return true;
};

const getZhihuDataForApi = async () => {
  // !!!!!!
  updateTime();

  let fileData = await readFile(fileName2, 'utf8');

  if (!fileData) {
    let ifGet = await getZhihuData();

    if (!ifGet) {
      return [];
    }

    fileData = await readFile(fileName2, 'utf8');
  }

  return JSON.parse(fileData);
};

// only for local test
// getZhihuData();

exports.getZhihuData = getZhihuData;
exports.getZhihuDataForApi = getZhihuDataForApi;
