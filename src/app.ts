import express from 'express'
import BusinessRouter from './controllers/BusinessController'
import injector from './container'

const app = express()
app.use(express.json())

app.use('/businesses', injector.injectFunction(BusinessRouter))

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server