import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import logger from './logger'

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    const log = logger.child({ req_id: uuidv4() }, true);
    log.info({ req });
    res.on("finish", () => log.info({ res }));
    next();
});

export default app