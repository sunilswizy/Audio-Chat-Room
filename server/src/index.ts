import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';


const app = express();

app.use(cors());
app.use(express.json())

const PORT = process.env.PORT ?? 5000


app.use('/auth', authRouter)


app.listen(PORT, () => {
    console.log("App is listening on PORT ", PORT);
})