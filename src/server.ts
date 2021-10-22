import app from './app'
import BusinessRouter from './routes/business.routes'
import container from './container'

app.use('/v1/businesses', container.injectFunction(BusinessRouter))

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server