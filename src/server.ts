import container from './container'
import BusinessController from './controllers/business.controllers'
import createApp from './app'

const app = createApp({
  businessController: container.injectClass(BusinessController)
})

const server = app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})

export default server