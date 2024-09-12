import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './router';

const PORT = 8080;
const app: Express = express();

app.use(express.json());
app.use('/api', router);

async function startApp() {
    try {
        await mongoose.connect('mongodb://localhost:27017/waste-into-city');
        app.listen(PORT, () => console.log('Aboba'));
    } catch (e) {
        console.log(e);
    }
}

startApp();
