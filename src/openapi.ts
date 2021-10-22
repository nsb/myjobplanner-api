import path from 'path/posix'
import * as OpenApiValidator from 'express-openapi-validator'

const openApi = OpenApiValidator.middleware({
  apiSpec: path.join(__dirname, '../openapi.yaml'),
  validateResponses: true
})

export default openApi