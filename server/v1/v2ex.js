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

const urlPrefix = 'https://www.v2ex.com';

const handleData = (body, tag) => {
  let objs = [];
  let $ = cheerio.load(body);

  let els = $(tag);

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

const handleNodeData = (body) => {
  return handleData(body, '#TopicsNode .cell .item_title .topic-link');
};

const getNode = async (id) => {
  if (originalData === undefined || id < 1) {
    return null;
  }

  // 需要进行 - 1 处理
  let url = originalData[id - 1].url;

  let res = await getBody(url);

  return handleNodeData(res);
};

const handleHotData = (body) => {
  return handleData(body, '#Main .cell .topic-link');
};

const getHotDataForAPI = async () => {
  let res = await getBody(`${urlPrefix}/?tab=hot`);

  // let res = await readFile(path.resolve(__dirname, `../t2.html`), 'utf8');

  return handleHotData(res);
};

/**
 * node id = 0 is not exist
 * so use as default for case all
 */
const getNodesDataForAPI = async (id = 0) => {
  if (id === 0) {
    return await getNodesData();
  } else {
    return await getNode(id);
  }
};

exports.getNodesDataForAPI = getNodesDataForAPI;
exports.getHotDataForAPI = getHotDataForAPI;

/**
 * I: initial
 * T: test
 */
(async () => {
  // I
  await getNodesData();

  // T
  // let x = await getNode(2);

  // let x = await getHot();

  // console.log(x);
})();
