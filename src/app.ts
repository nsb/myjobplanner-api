import 'reflect-metadata'
import express, { response } from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import JwksRsa from 'jwks-rsa';
import { Container } from 'typedi'
import db from './postgres'
import BusinessController from './controllers/BusinessController';

const app = express()
app.use(express.json())

const businessController = Container.get(BusinessController)

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

app.get('/businesses', checkJwt, jwtAuthz(['read:business']), (req, res) => businessController.getAllBusinesses(req, res))

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server