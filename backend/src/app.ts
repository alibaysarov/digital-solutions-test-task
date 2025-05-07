import 'reflect-metadata';
import express, {Express} from 'express';
import itemRoutes from './routes/itemRoutes';
import { errorHandler } from './middlewares/errorHandler';
import cors from "cors"
const app:Express = express();
app.use(cors())
app.use(express.json());


app.use('/api/v1/users', itemRoutes);

app.use(errorHandler);


export default app;