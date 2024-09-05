import { Router } from "express";

const TaskRouter = Router();

import { postLogin, getSession, deleteSession, postRegister } from "../controllers/auth.controllers.js";

TaskRouter.post('/register', postRegister);
TaskRouter.post('/login', postLogin);
TaskRouter.get('/session', getSession);
TaskRouter.post('/logout', deleteSession);

export { TaskRouter };