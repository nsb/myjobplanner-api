import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import { apiSpec } from './openapi'
import BusinessRouter from './routes/business.routes'
import EmployeeRouter from './routes/employee.routes'
import ClientRouter from './routes/client.routes'
import PropertyRouter from './routes/property.routes'
import JobRouter from './routes/job.routes'
import VisitRouter from './routes/visit.routes'
import {
  businessRoutesContainer,
  employeeRoutesContainer,
  clientRoutesContainer,
  jobRoutesContainer,
  propertyRoutesContainer,
  visitRoutesContainer
} from './container'
import logger from './logger'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  const log = logger.child({ req_id: uuidv4() }, true)
  log.info({ req })
  res.on('finish', () => log.info({ res }))
  next()
})

app.get('/schema.json', (_req, res) => res.json(apiSpec))
app.use('/healthz', (_req, res) => res.json({ status: 'Ok' }))
app.use('/v1', businessRoutesContainer.injectFunction(BusinessRouter))
app.use('/v1', employeeRoutesContainer.injectFunction(EmployeeRouter))
app.use('/v1', clientRoutesContainer.injectFunction(ClientRouter))
app.use('/v1', propertyRoutesContainer.injectFunction(PropertyRouter))
app.use('/v1', jobRoutesContainer.injectFunction(JobRouter))
app.use('/v1', visitRoutesContainer.injectFunction(VisitRouter))

export default app
