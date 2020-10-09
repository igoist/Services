const path = require('path');
const cheerio = require('cheerio');
const utils = require('../utils');

const { readFile } = utils.file;
const { getBody } = utils.web;

let fileName = path.resolve(__dirname, `../../data/v2ex/all.json`);

let originalData;

const getNodesData = async () => {
  let fileData = await readFile(fileName, 'utf8');

  originalData = JSON.parse(fileData);

  return originalData;
};

const urlPrefix = 'www.v2ex.com';

const handleData = (data) => {
  let objs = [];
  let $ = cheerio.load(data);

  let els = $('#TopicsNode .cell .item_title .topic-link');

  for (let i = 0; i < els.length; i++) {
    // console.log(els[i].attribs.href);
    // console.log(els[i].children[0].data);

    objs.push({
      title: els[i].children[0].data,
      link: urlPrefix + els[i].attribs.href
    });
  }

  return objs;
};

const getNode = async (id) => {
  if (originalData === undefined) {
    return null;
  }

  // index 那边已经自动做了 -1 处理
  let url = originalData[id].url;

  console.log('getNode: ', url);

  let res = await getBody(url);

  return handleData(res);
};

/**
 * node id = 0 is not exist
 * so use as default for case all
 */
const getNodesDataForApi = async (id = 0) => {
  if (id === 0) {
    return await getNodesData();
  } else {
    return await getNode(id);
  }
};

exports.getNodesDataForApi = getNodesDataForApi;

(async () => {
  await getNodesData();

  // let x = await getNode(2);

  // console.log(x);
})();
