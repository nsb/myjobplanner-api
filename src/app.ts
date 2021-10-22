import express from 'express'
import path from 'path/posix'
import swaggerUi from 'swagger-ui-express'

const app = express()
app.use(express.json())

const spec = path.join(__dirname, '../openapi.yaml');
app.use('/api-docs', express.static(spec));

app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "http://localhost:3000/api-docs"
    }
  })
)

export default app