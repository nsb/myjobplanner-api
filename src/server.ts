import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'
import app from './app'
import BusinessRouter from './routes/business.routes'
import ClientRouter from './routes/client.routes'
import container from './container'
import HealthRouter from './routes/health.routes'
import logger from './logger'

app.use('/healthz', container.injectFunction(HealthRouter))
app.use('/v1/businesses', container.injectFunction(BusinessRouter))
app.use('/v1/clients', container.injectFunction(ClientRouter))

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, undefined, {
    oauth: {
      clientId: `${process.env.AUTH0_SWAGGER_UI_CLIENT_ID}`
    }
  })
)

const server = app.listen(process.env.PORT, () => {
  logger.info(`The application is listening on port ${process.env.PORT}!`);
})

export default server