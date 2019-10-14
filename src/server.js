const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonXmlHandler = require('./jsonXmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  // if post is to /addEvent (our only POST url)
  if (parsedUrl.pathname === '/addEvent') {
    const res = response;

    // uploads come in as a byte stream that we need
    // to reassemble once it's all arrived
    const body = [];

    // if the upload stream errors out, just throw a
    // a bad request and send it back
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. We will add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array (using Buffer.concat)
      // and convert it to a string value (in this instance)
      const bodyString = Buffer.concat(body).toString();
      // since we are getting x-www-form-urlencoded data
      // the format will be the same as querystrings
      // Parse the string into an object by field name
      const bodyParams = query.parse(bodyString);

      // pass to our addEvent function
      jsonXmlHandler.addEvent(request, res, bodyParams);
    });
  }
};


// handle GET requests
const handleGet = (request, response, parsedUrl, params, head) => {
  // route to correct method based on url
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getEvents') {
    jsonXmlHandler.getEvents(request, response, params, head);
  } else if (parsedUrl.pathname === '/notReal') {
    jsonXmlHandler.notFound(request, response, head);
  } else {
    htmlHandler.getIndex(request, response);
  }
};


const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/addEvent': handlePost,
  '/getEvents': handleGet,
  notFound: jsonXmlHandler.notFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query); // will need this for get with text
  let head = false;
  if (request.method === 'HEAD') {
    head = true;
  }

  // console.log(`onRequest params: ${JSON.stringify(params)}`);
  // const types = request.headers.accept.split(',');

  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, parsedUrl, params, head /* , types */);
  } else {
    urlStruct.notFound(request, response/* , params, types */);
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
