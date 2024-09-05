
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import { TaskRouter } from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

const __dirname = path.resolve();

// Middlewares 
app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://localhost:3000',
        "http://localhost:5000",
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        httpOnly: true,
    }
}));


app.use('/auth', TaskRouter);

// Iniciar el servidor
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

