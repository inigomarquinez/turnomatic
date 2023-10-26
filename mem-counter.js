import express from 'express';
import { createClient } from 'redis';
import MemCounter from './MemCounter.js';
import 'dotenv/config'

const BATCH_SIZE = 10;
const port = process.env.PORT
const app = express()

let memCounterMap = new Map();
let currentBatch = null;

const redis = await createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`
})
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

// await client.disconnect();

const getNextBatch = async (groupId) => {
  try {
    return await redis.incr(groupId) - 1;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// https://thisdavej.com/guides/redis-node/node/counters.html
const getNextTurn = async (groupId) => {
  if (!memCounterMap.has(groupId)) {
    memCounterMap.set(groupId, new MemCounter(BATCH_SIZE));
  }
  const memCounter = memCounterMap.get(groupId);
  try {
    if (currentBatch === null) {
      console.log('currentBatch :>> ', currentBatch);
      currentBatch = getNextBatch(groupId);
      return await currentBatch * BATCH_SIZE;
    }
    return await memCounter.inc() + await currentBatch * BATCH_SIZE;
  } catch (error) {
    console.error(error);

    memCounterMap.set(groupId, new MemCounter(BATCH_SIZE));
    currentBatch = getNextBatch(groupId);
    return await currentBatch * BATCH_SIZE;
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
    console.log('error :>> ', error);
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
