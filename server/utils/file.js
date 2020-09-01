const log = console.log.bind(this);
const fs = require('fs');

const writeFile = (fileName, data) => {
  return new Promise((resolve) => {
    fs.writeFile(fileName, data, (err) => {
      if (err) {
        log(`write ${fileName} failed:`, err);
        resolve(false);
        return;
      }
      console.log(`The file ${fileName} has been saved!`);
      resolve(true);
    });
  });
};

const readFile = (fileName, fileType) => {
  return new Promise((resolve) => {
    fs.readFile(fileName, fileType, (err, data) => {
      if (err) {
        log(`readFile ${fileName} failed: `, err);
        resolve(false);
        return;
      }
      resolve(data);
    });
  });
};

const guaranteeDirExist = (dirName) => {
  return new Promise((resolve) => {
    if (!fs.existsSync(dirName)) {
      fs.mkdirSync(dirName);
      console.log(`The target dir ${dirName} did not exist, so create it.`);
      resolve(0);
      return;
    }
    resolve(1);
  });
};

exports.readFile = readFile;
exports.writeFile = writeFile;
exports.guaranteeDirExist = guaranteeDirExist;
