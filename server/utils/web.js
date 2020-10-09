const request = require('request');

const getBody = (uri) => {
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

exports.getBody = getBody;
