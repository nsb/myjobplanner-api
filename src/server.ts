import path from 'path'
import { initialize } from 'express-openapi'
import V1ApiDoc from './api-doc'
import app from './app'
import container from './container'
import swaggerUi from 'swagger-ui-express'
import BusinessController from './controllers/business.controllers'

initialize({
  apiDoc: V1ApiDoc,
  app,
  paths: path.resolve(__dirname, './routes'),
  dependencies: {
    businessController: container.injectClass(BusinessController)
  },
  routesGlob: '**/*.{ts,js}',
  routesIndexFileRegExp: /(?:index)?\.[tj]s$/
})

app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "http://localhost:3000/api-docs",
    },
  })
);

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server