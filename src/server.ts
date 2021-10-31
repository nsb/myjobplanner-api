import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'
import app from './app'
import BusinessRouter from './routes/business.routes'
import container from './container'

app.use('/v1/businesses', container.injectFunction(BusinessRouter))

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(apiSpec, undefined, {
    oauth: {
      clientId: `${process.env.AUTH0_SWAGGER_UI_CLIENT_ID}`
    }
  })
)

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server