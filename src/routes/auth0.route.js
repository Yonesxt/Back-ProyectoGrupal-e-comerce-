const { Router } = require('express');
const {  infoProfile } = require('../controllers/auth0.controllers');
const {expressjwt} = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const {
  AUTH0_DOMAIN, AUTH0_AUDIENCE
} = process.env;

const router = Router();


//Auth0 JWT
const authorizationAccess = expressjwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
  
    // Validate the audience and the issuer.
    audience: AUTH0_AUDIENCE,
    issuer: `https://dev-81nqhdy2.us.auth0.com/`,
    algorithms: ["RS256"],
});



router.post("/profile", authorizationAccess  ,infoProfile);

module.exports = router;