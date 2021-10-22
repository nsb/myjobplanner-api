import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { apiSpec } from './openapi'

const app = express()
app.use(express.json())

app.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(apiSpec)
)

export default app