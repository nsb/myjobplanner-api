import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'
import app from './app'
import BusinessRouter from './routes/business.routes'
import container from './container'

app.use('/v1/businesses', container.injectFunction(BusinessRouter))

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(apiSpec)
)

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server