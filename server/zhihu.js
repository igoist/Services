const log = console.log.bind(this);

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

let time = new Date();
const tmpTS = +time;

const handleDate = () => {
  let y = time.getYear() + 1900;
  let m = time.getMonth() + 1;
  let d = time.getDate() + 1;

  if (m < 10) {
    m = '0' + m;
  }
  if (d < 10) {
    d = '0' + d;
  }

  return `${y}-${m}-${d}`;
};

const fileName = path.resolve(__dirname, `../tmps/tmp-${tmpTS}.html`);
const fileName2 = path.resolve(__dirname, `../data/data-${handleDate()}.json`);

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
        log('here error: ', error);
        resolve(body);
      }
    );
  });
};

let objs = [];

const handleFile = (fileName, resultName) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err;
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

    let tmpFileName = resultName || 'data/test.json';

    fs.writeFile(tmpFileName, JSON.stringify(objs, null, 2), (err) => {
      if (err) throw err;
      console.log(`The file ${tmpFileName} has been saved!`);
    });
  });
};

const writeAndHandle = (res) => {
  return Promise((resolve) => {
    fs.writeFile(fileName, res, (err) => {
      if (err) throw err;
      console.log(`The file ${fileName} has been saved!`);
      try {
        handleFile(fileName, fileName2);
      } catch (err) {
        console.log('err when handleFile: ', err);
      }
    });
  });
};

const getZhihuData = async () => {
  let res = await getData();

  await writeAndHandle(res);
};

const sth = (callback) => {};

const getZhihuDataForApi = () => {
  return new Promise((resolve) => {
    fs.readFile(fileName2, 'utf8', (err, data) => {
      if (err) {
        sth((res) => {
          resolve(JSON.parse(data));
        });
      }
      // resolve(JSON.parse(data));
    });
  });
};

// only for local test
// getZhihuData();

exports.getZhihuData = getZhihuData;
exports.getZhihuDataForApi = getZhihuDataForApi;
