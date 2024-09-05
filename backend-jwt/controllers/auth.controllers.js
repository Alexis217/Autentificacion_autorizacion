
import { newConnection } from "../db/database";
import generarJwt from "../helpers/generar-jwt";
import bcrypt from 'bcrypt';


export const Register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const connection = await newConnection();
        if (!connection) {
            return res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }

        // Encriptar la contraseñas
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        return res.json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al registrar el usuario' });
    }
}

export const Login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await newConnection();
        if (!connection) {
            return res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = await generarJwt(rows[0].id);

        // Almacenar el token en la sesión del servidor
        req.session.token = token;

        // Almacenar el token en una cookie segura
        res.cookie('authToken', token, {
            httpOnly: true, // La cookie no es accesible desde JavaScript
            secure: false, // Cambiar a true en conexión con HTTPS
            maxAge: 3600000 // Expiración en milisegundos (1 hora)
        });

        return res.json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
}