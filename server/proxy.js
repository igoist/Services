var http = require('http');
var https = require('https');
var net = require('net');
var url = require('url');

const returnRequest = (requestType) => {
  let tmp;

  if (requestType === 'https') {
    console.log('enter!');
    tmp = https;
  } else {
    tmp = http;
  }

  return (cReq, cRes) => {
    var u = url.parse(cReq.url);
    console.log({
      cReqUrl: cReq.url
    });
    console.log('url', u);

    var options = {
      hostname: u.hostname,
      port: u.port || 80,
      path: u.path,
      method: cReq.method,
      headers: cReq.headers
    };

    var pReq = tmp
      .request(options, function (pRes) {
        cRes.writeHead(pRes.statusCode, pRes.headers);
        pRes.pipe(cRes);
      })
      .on('error', function (e) {
        cRes.end();
      });

    cReq.pipe(pReq);
  };
};

http.createServer().on('request', returnRequest('http')).listen(8888, '0.0.0.0');
// console.log(https);
// https.createServer().on('request', returnRequest('https')).listen(8888, '0.0.0.0');
