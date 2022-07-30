import jwt from 'express-jwt'
import JwksRsa from 'jwks-rsa'

const checkJwt = jwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${process.env.AUTH0_DOMAIN}.well-known/jwks.json`
  }),
  audience: `${process.env.AUTH0_IDENTIFIER}`,
  issuer: [`${process.env.AUTH0_DOMAIN}`],
  algorithms: ['RS256'],
  credentialsRequired: process.env.SKIP_JWT_VERIFICATION !== 'true'
})

export default checkJwt
