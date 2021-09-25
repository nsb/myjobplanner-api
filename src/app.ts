import express, { response } from 'express';
import jwt from 'express-jwt';
import jwtAuthz from 'express-jwt-authz';
import JwksRsa from 'jwks-rsa';
import db from './postgres'

const app = express()
app.use(express.json())

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
  db.query('SELECT * from business ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
})

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server