import express from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import JwksRsa from 'jwks-rsa';

const app = express();

const checkJwt = jwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: `${process.env.AUTH0_IDENTIFIER}`,
  issuer: [`${process.env.AUTH0_DOMAIN}`],
  algorithms: ['RS256']
});

app.get('/businesses', checkJwt, jwtAuthz(['read:business']), (req, res) => {
  res.json({ name: "Idealrent" });
})

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server