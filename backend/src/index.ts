import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import router from './router';
import fileUpload from 'express-fileupload';

const PORT = 8080;
const app: Express = express();

app.use(express.json());
app.use(fileUpload({}));
app.use(express.static('static'));
app.use('/api', router);

async function startApp() {
    try {
        await mongoose.connect('mongodb://localhost:27017/waste-into-city');
        app.listen(PORT, () => console.log('Server is running'));
    } catch (e) {
        console.log(e);
    }
}

startApp();
