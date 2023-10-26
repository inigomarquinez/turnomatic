import express from 'express';
import { createClient } from 'redis';
import 'dotenv/config'

const port = process.env.PORT
const app = express()

const redis = await createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

// await client.disconnect();

const getNextTurn = async (groupId) => {
  try {
    return await redis.incr(groupId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.get('/', async (req, res) => {
  res.send('Welcome to turnomatic!');
})

app.get('/turno/:id', async (req, res) => {
  try {
    res.send(
      {
        id: req.params.id,
        turno: await getNextTurn(req.params.id)
      }
    )
  } catch (error) {
    console.log('error :>> ', error);
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
