const path = require('path');
const utils = require('../utils');

const { readFile } = utils.file;

let fileName = path.resolve(__dirname, `../../data/renting/renting.json`);

const getRentingData = async () => {
  let fileData = await readFile(fileName, 'utf8');

  // return JSON.parse(fileData).slice(0, 598);
  return JSON.parse(fileData);
};

const getRentingDataForAPI = async () => {
  return await getRentingData();
};

exports.getRentingDataForAPI = getRentingDataForAPI;
