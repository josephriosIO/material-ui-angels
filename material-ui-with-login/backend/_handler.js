import express from 'express';
import { defaultHandler } from '@reshuffle/server-function';
import { authRouter } from '@reshuffle/passport';

const app = express();
app.use(authRouter());

app.get('/hi', async (req, res) => {
  res.send('hi');
});

app.use(defaultHandler);

export default app;

