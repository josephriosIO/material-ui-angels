import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import { authRouter } from '@reshuffle/passport';
import devDBAdmin from '@reshuffle/db-admin';
import adminRouter from './adminRouter'
import usersRouter from './usersRouter';
import startupRouter from './startupRouter';


const app = express();
app.use(authRouter());
app.use(express.json());

app.use("/dev/db-admin", devDBAdmin.devDBAdminHandler);
//use the /admin router file
app.use("/api/admin", adminRouter);
//use the /users router file
app.use("/api/users", usersRouter);
//use the /startups router file
app.use("/api/startups", startupRouter);


app.use(defaultHandler);


export default app;
