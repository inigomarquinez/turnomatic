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

// https://thisdavej.com/guides/redis-node/node/counters.html
const getNextTurn = async (groupId) => {
  try {
    return await redis.incr(groupId);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.get('/turno/:id', async (req, res) => {
  try {
    res.send(
      {
        id: req.params.id,
        turno: await getNextTurn(req.params.id)
      }
    )
  } catch (error) {
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
