import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import { authRouter } from '@reshuffle/passport';
import devDBAdmin from '@reshuffle/db-admin';

const app = express();
app.use(authRouter());

app.use("/dev/db-admin", express.json(), devDBAdmin.devDBAdminHandler);

app.use(defaultHandler);

export default app;
