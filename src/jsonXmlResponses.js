const users = {};


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

const addUser = (request, response, body) => {
  const responseJSON = {
    message: 'Name and Age are both required.',
  };

  if (!body.name || !body.age) {
    responseJSON.id = 'missingParams';
    return respond(request, response, 400, responseJSON);
  }

  // defaults to created
  let responseCode = 201;
  // if that user's name already exists in our object
  // then switch to a 204 updated status
  if (users[body.name]) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].age = body.age;

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
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  return respond(request, response, 200, responseJSON);
};


const notFound = (request, response,/* , params , type */) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  return respond(request, response, 404, responseJSON/* , 'application/json' */);
};

module.exports = {
  // success,
  // badRequest,
  addUser,
  getUsers,
  notFound,
  // unauthorized,
  // forbidden,
  // internal,
  // notImplemented,
};
