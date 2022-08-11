const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index.js');

//Auth
const {
  SECRET,
  BASEURL,
  CLIENTID,
  ISSUER,
  CLIENTSECRET
} = process.env

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASEURL,
  clientID: CLIENTID,
  issuerBaseURL: ISSUER,
  clientSecret : CLIENTSECRET,
  authorizationParams: {
    response_type : 'code',
    audience : 'https://dev-81nqhdy2.us.auth0.com/api/v2/',
    scope : 'openid profile email'
  }
};



require('./db.js');
const cors = require('cors')
const server = express();

server.name = 'API';
server.use(cors())
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//AUTH
server.use(auth(config))

server.use('/api', routes);

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
