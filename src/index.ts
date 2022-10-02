import express from 'express';
import router from './routes/index.route';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/', router);

const port = process.env.PORT || '3000';
app.listen(port);
