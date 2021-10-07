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

app.get('/businesses', checkJwt, jwtAuthz(['read:business']), async (req, res) => {
  const result = await db.query('SELECT * from businesses ORDER BY id ASC')
  res.status(200).json(result.rows)
})

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server