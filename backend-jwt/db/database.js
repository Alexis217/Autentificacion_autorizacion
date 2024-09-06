import { createConnection } from "mysql2/promise";

export const newConnection = async () => {
    try {
        const connection = await createConnection({
            host: "localhost",
            user: "root",
            database: "db_system",
            port: 3306
        });
        console.log("Conexión exitosa a la base de datos");
        return connection;
    } catch (error) {
        console.error("Error al conectarse a la base de datos", error);
        throw new Error("Error al conectarse a la base de datos");
    }
};

