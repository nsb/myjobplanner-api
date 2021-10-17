import express from 'express'
import path from 'path'
import { initialize } from 'express-openapi'
import V1ApiDoc from './api-doc'
import container from './container'
import swaggerUi from 'swagger-ui-express'
import BusinessController from './controllers/business.controllers'

const app = express()
app.use(express.json())

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


export default app