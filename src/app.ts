import express, {NextFunction, Request, Response} from 'express'
import {router} from './routes/brainroutes'
import {globalErrorHandler} from './controllers/globalErrorHandler'

export const app = express();

app.use(express.json())


app.get('/', (req : Request, res: Response) => {
    res.send('HEllo Second Brain')
})
app.use('/api/v1', router)

app.use(globalErrorHandler)



