import express from 'express';
import { createClient } from 'redis';
import 'dotenv/config'

const port = process.env.PORT
const app = express()

// const client = await createClient()
//   .on('error', err => console.log('Redis Client Error', err))
//   .connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();


app.get('/turno/:id', (req, res) => {
  res.send(
    {
      id: req.params.id,
      turno: Math.floor(Math.random() * 100)
    }
  )
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
