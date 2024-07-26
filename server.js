import express from 'express';
import { APP_PORT, PRISUMEDB } from './config';

const app = express();

import route from './routes'
import errorHandler from './middlewares/errorHandler';
import mongoose from 'mongoose';
import CustomErrorHandler from './services/customErrorHandler';
import cors from 'cors';

app.use(cors());
app.use(express.json());
app.use(route);

app.use(errorHandler);
app.listen(APP_PORT, () => console.log(`Listening from ${APP_PORT}`));

mongoose.connect(PRISUMEDB).then(()=>console.log("DB connected!")).catch((err)=> {
    CustomErrorHandler.dbError("Even after one year you can not connect the database, please die in peace!")
})