import prisma from "@sora/db/client";
import { generationQueue, addJob } from "@sora/queue/queue";
import { config } from "@sora/config/config";

import express from "express";
import dotenv from 'dotenv'
import v1Router from './routes/v1'


const app = express()

dotenv.config()


app.use(express.json())


app.use('/api/v1', v1Router)

app.listen(config.PORT, () => {
    console.log(`Server is running on port${config.PORT}`)
})

export { prisma, generationQueue, addJob  };