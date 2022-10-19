import express from 'express';
import router from './routes/index.route';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use('/', router);

const port = process.env.PORT || '3000';
app.listen(port);
