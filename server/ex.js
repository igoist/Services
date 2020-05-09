const fs = require('fs');
const path = require('path');

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

const fileName = path.resolve(__dirname, `../data/data-${handleDate()}.json`);

exports.getData = () => {
  return new Promise((resolve) => {
    fs.readFile(fileName, 'utf8', (err, data) => {
      resolve(JSON.parse(data));
    });
  });
};
