import { newConnection } from "../db/database.js";

export const postRegister = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        const connection = await newConnection();
        if (!connection) {
            return res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            return res.status(409).json({ message: 'El usuario ya existe' });
        } else {
            await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
            return res.status(201).json({ message: 'Usuario creado exitosamente' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const connection = await newConnection();
        if (!connection) {
            return res.status(500).json({ message: 'Error al conectar con la base de datos' });
        }

        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);

        if (rows.length > 0) {
            req.session.userId = rows[0].id;
            req.session.username = rows[0].username;
            return res.json({
                message: 'Inicio de sesión exitoso',
                user: { id: rows[0].id, username: rows[0].username }
            });
        } else {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getSession = async (req, res) => {
    try {
        if (req.session.userId) {
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
        res.clearCookie('connect.sid'); // Nombre de cookie por defecto para express-session
        return res.json({ message: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
