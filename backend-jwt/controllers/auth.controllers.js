
import { newConnection } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";
import bcrypt from 'bcrypt';


export const Register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await newConnection();
        if (!connection) {
            return res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }

        // Encriptar la contraseña
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

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const user = rows[0];

        // Compara la contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        // Generar token JWT
        const token = await generarJwt(user.id);

        // Almacenar el token en la sesión del servidor
        req.session.token = token;
        req.session.userId = user.id;
        req.session.username = user.username;

        // Almacenar el token en una cookie segura
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: false, // Cambiar a true en conexión con HTTPS
            maxAge: 18000000 // Expiración en milisegundos (5 hora)
        });

        // Enviar una respuesta con el nombre de usuario
        return res.json({ message: 'Inicio de sesión exitoso', username: user.username });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
};


export const GetSession = async (req, res) => {
    try {
        if (req.session.token) {
            return res.json({
                loggedIn: true,
                user: { id: req.session.userId, username: req.session.username }
            });
        } else {
            return res.status(401).json({ loggedIn: false, message: 'No hay sesión activa' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
}
}

export const deleteSession = async (req, res) => {
    try {
        req.session.destroy();
        res.clearCookie('authToken');
        return res.json({ message: 'Cierre de sesión exitoso' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error Inesperado' });
    }
}