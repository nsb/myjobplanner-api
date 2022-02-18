import bunyan from 'bunyan'

const logger = bunyan.createLogger({
    name: "myJobplanner-api",
    serializers: bunyan.stdSerializers,
})

export default logger