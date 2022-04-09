import bunyan from 'bunyan'

const logger = bunyan.createLogger({
  name: 'myJobplanner-api',
  serializers: bunyan.stdSerializers,
  level: process.env.LOG_LEVEL
})

export default logger
