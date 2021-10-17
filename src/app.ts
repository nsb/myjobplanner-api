import express, { Express } from 'express'
import path from 'path'
import { initialize } from 'express-openapi'
import V1ApiDoc from './api-doc'
import swaggerUi from 'swagger-ui-express'

function createApp(dependencies: { [service: string]: any }): Express {
  const app = express()
  app.use(express.json())

  initialize({
    apiDoc: V1ApiDoc,
    app,
    paths: path.resolve(__dirname, './routes'),
    dependencies,
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

  return app
}

export default createApp