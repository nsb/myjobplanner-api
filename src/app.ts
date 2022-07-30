import express from 'express'
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
import checkJwt from './jwt'

const app = express()
app.use(express.json())

app.get('/schema.json', (_req, res) => res.json(apiSpec))
app.get('/healthz', (_req, res) => res.json({ status: 'Ok' }))

const apiRouter = express.Router()
apiRouter.use(checkJwt)
apiRouter.use(businessRoutesContainer.injectFunction(BusinessRouter))
apiRouter.use(employeeRoutesContainer.injectFunction(EmployeeRouter))
apiRouter.use(clientRoutesContainer.injectFunction(ClientRouter))
apiRouter.use(propertyRoutesContainer.injectFunction(PropertyRouter))
apiRouter.use(jobRoutesContainer.injectFunction(JobRouter))
apiRouter.use(visitRoutesContainer.injectFunction(VisitRouter))
app.use('/v1', apiRouter)

export default app
