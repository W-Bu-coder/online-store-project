const express = require('express')
const app = express()
const cors = require('cors');
const port = 3036

app.use(cors({
  origin: 'http://localhost:3000' // frontend url
}));

app.get('/hello', (req, res) => {
  console.log('Received: ')
  console.log(req)
  let data = JSON.stringify('Hello World!')
  res.send(data)
})

app.listen(port, () => {
  console.log(`Backend is listening on port ${port}`)
})