const log = console.log.bind(this);
const fs = require('fs');
const path = require('path');

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

const readDir = (dirName) => {
  return new Promise((resolve) => {
    fs.readdir(dirName, (err, files) => {
      if (err) {
        console.log(`read ${dirName} failed:`, err);
        resolve(false);
        return;
      }

      console.log(`${dirName} has been read!`);
      resolve(files);
    });
  });
};

const handleFile = (dirPath, lv) => {
  return async (file) => {
    if (file.match(/^\..*/)) {
      console.log('this file match the regex: ', path.resolve(dirPath, file));
      return null;
    }

    const extname = path.extname(file).trim().toLocaleLowerCase();

    let item = {
      name: file,
      path: dirPath + file,
      level: lv
    };

    // console.log(`${lv} -- ${file}`);
    if (!extname) {
      // console.log('this guy is dir?!: ', file);
      item.path += '/';

      let r = await analyzeDir(item.path, item.level + 1);

      item.children = r;
    } else {
    }

    return item;
  };
};

// dirPath 必须以 / 结尾
const analyzeDir = async (dirPath, lv) => {
  let files = await readDir(dirPath);
  let arr = [];

  for (let i = 0; i < files.length; i++) {
    let item = await handleFile(dirPath, lv)(files[i]);
    if (item) {
      arr.push(item);
    }
  }

  console.log('================XX: ', lv);
  return arr;
};

exports.readFile = readFile;
exports.writeFile = writeFile;
exports.guaranteeDirExist = guaranteeDirExist;
exports.readDir = readDir;
exports.analyzeDir = analyzeDir;
