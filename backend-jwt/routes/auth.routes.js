import { Router } from "express";

const Elrouter = Router();

import { Login, Register, GetSession, deleteSession  } from "../controllers/auth.controllers.js";

Elrouter.post('/register', Register);
Elrouter.post('/login', Login);
Elrouter.get('/session', GetSession);
Elrouter.post('/logout', deleteSession);

export { Elrouter };