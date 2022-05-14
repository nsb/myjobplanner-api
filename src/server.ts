import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'
import app from './app'
import BusinessRouter from './routes/business.routes'
import ClientRouter from './routes/client.routes'
import PropertyRouter from './routes/property.routes'
import JobRouter from './routes/job.routes'
import VisitRouter from './routes/visit.routes'
import {
  businessRoutesContainer,
  clientRoutesContainer,
  jobRoutesContainer,
  propertyRoutesContainer,
  visitRoutesContainer
} from './container'
import logger from './logger'

app.get('/schema.json', (_req, res) => res.json(apiSpec))
app.use('/healthz', (_req, res) => res.json({ status: 'Ok' }))
app.use('/v1', businessRoutesContainer.injectFunction(BusinessRouter))
app.use('/v1', clientRoutesContainer.injectFunction(ClientRouter))
app.use('/v1', propertyRoutesContainer.injectFunction(PropertyRouter))
app.use('/v1', jobRoutesContainer.injectFunction(JobRouter))
app.use('/v1', visitRoutesContainer.injectFunction(VisitRouter))

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, undefined, {
    oauth: {
      clientId: `${process.env.AUTH0_SWAGGER_UI_CLIENT_ID}`
    }
  })
)

const server = app.listen(process.env.PORT, () => {
  logger.info(`The application is listening on port ${process.env.PORT}!`)
})

export default server
