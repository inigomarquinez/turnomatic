const express = require('express')
const app = express()
const port = 7017

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
