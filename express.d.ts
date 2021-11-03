type DecodedToken = {
  iss: string
  sub: string
  aud: Array<string>
  iat: number
  exp: number
  azp: string
  scope: string
}

declare namespace Express {
  export interface Request {
    user?: DecodedToken
  }
}
