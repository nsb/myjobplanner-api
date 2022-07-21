import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'
import app from './app'
import logger from './logger'

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, undefined, {
    oauth: {
      clientId: `${process.env.AUTH0_SWAGGER_UI_CLIENT_ID}`
    }
  })
)

const server = app.listen(process.env.PORT || 3000, () => {
  logger.info(`The application is listening on port ${process.env.PORT || 3000}!`)
})

export default server
