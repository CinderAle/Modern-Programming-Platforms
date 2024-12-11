import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './router';
import fileUpload from 'express-fileupload';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { Server } from 'socket.io';
import { SOCKET_MESSAGES } from './constants/socketMessages';
import http from 'http';
import { socketConnectedListener } from './sockets';

dotenv.config();

const PORT = Number(process.env.PORT);
const app: Express = express();
const ALLOWED_ORIGINS = ['http://localhost:5173'];

app.use(cookieParser());
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed bu CORS!'));
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(fileUpload({}));
app.use(express.static('static'));
app.use(methodOverride('_method'));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use('/api', router);
app.set('view engine', 'ejs');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS!'));
            }
        },
        credentials: true,
    },
});
io.on(SOCKET_MESSAGES.CONNECTION, socketConnectedListener);

async function startApp() {
    try {
        await mongoose.connect('mongodb://localhost:27017/waste-into-city');
        server.listen(PORT, () => console.log('Server is running'));
    } catch (e) {
        console.log(e);
    }
}

startApp();
