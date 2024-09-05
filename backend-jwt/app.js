// server.js
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import { PORT } from './config/env.js';
import generarJwt from './helpers/generar-jwt.js';
import validarJwt from './middlewares/validar-jwt.js';
import morgan from 'morgan';
import { newConnection } from './db/database.js';


const app = express();

app.use(cors({
    origin: ['http://localhost:5500', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: 'session_secret_key', // Cambia esto por una clave secreta en producción
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usar 'true' si usas HTTPS
}));



// Endpoint para validar la sesión
app.get('/session', validarJwt, (req, res) => {
    console.log(req.user);
    return res.json({ message: 'Acceso permitido a área protegida', user: req.user });
});

// Endpoint de cierre de sesión (logout)
app.post('/logout', (req, res) => {
    try {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Error al cerrar sesión' });
            }

            res.clearCookie('authToken');
            return res.json({ message: 'Cierre de sesión exitoso' });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
});

// Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
