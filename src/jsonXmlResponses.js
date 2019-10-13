const events = {};


const respond = (request, response, status, /* object, */content/* , type */) => {
  response.writeHead(status, { 'Content-Type': /* type */ 'application/json' });
  response.write(JSON.stringify(content));
  // response.write(content);
  response.end();
};

const respondMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const addEvent = (request, response, body) => {
  const responseJSON = {
    message: 'Title and Description are both required.',
  };

  if (!body.title || !body.desc) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, responseJSON);
  }

  // defaults to created
  let responseCode = 201;
  // if that user's title already exists in our object
  // then switch to a 204 updated status
  if (events[body.title]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that title
    events[body.title] = {};
  }

  // const newSticky = {};

  // add or update fields for this user title
  // newSticky.title = body.title;

  // if (body.name) {
  //   newSticky.title = body.name;
  // }

  // if (body.place) {
  //   newSticky.place = body.place;
  // }

  // if (body.time) {
  //   newSticky.time = body.time;
  // }

  // newSticky.desc = body.desc;

  // events[body.title].event = newSticky;
  // events[body.title].title = body.title;

  if (body.name) {
    events[body.title].name = body.name;
  }

  if (body.place) {
    events[body.title].place = body.place;
  }

  if (body.time) {
    events[body.title].time = body.time;
  }

  events[body.title].desc = body.desc;



  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respond(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondMeta(request, response, responseCode);
};

// return user object as JSON
const getEvents = (request, response) => { // Change this to give baCK STICKIES BASED ON USERS
  const responseJSON = {
    events,
  };

  return respond(request, response, 200, responseJSON);
};


const notFound = (request, response/* , params , type */) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseJSON/* , 'application/json' */);
};

module.exports = {
  // success,
  // badRequest,
  addEvent,
  getEvents,
  notFound,
  // unauthorized,
  // forbidden,
  // internal,
  // notImplemented,
};
