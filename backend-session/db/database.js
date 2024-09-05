import { createConnection } from "mysql2/promise";

export const newConnection = async () => {
    try {
        const connection = await createConnection({
            host: "localhost",
            user: "root",
            database: "db_system",
        });
        return connection;
    } catch (error) {
        console.log(error,"Error al conectarse a la base de datos");
    }
};