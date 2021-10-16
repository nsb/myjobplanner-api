import app from './app'
import BusinessRouter from './controllers/BusinessController'
import injector from './container'

app.use('/businesses', injector.injectFunction(BusinessRouter))

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server