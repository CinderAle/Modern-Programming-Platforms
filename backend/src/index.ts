import express, { Express, Request, Response } from 'express';

const PORT = 8080;
const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    console.log(req.query);

    res.status(200).json('Server1');
});

app.listen(PORT, () => console.log('Aboba'));
