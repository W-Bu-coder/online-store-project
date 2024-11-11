const express = require('express')
const app = express()
const cors = require('cors');
const port = 3036

app.use(cors({
  origin: 'http://localhost:3000' // frontend url
}));

app.listen(port, () => {
  console.log(`Backend is listening on port ${port}`)
})

const createResponse = (data, code = 200, message = "success") => {
  return {
    code,
    message,
    data
  }
}

app.get('/hello', (req, res) => {
  console.log('Received: ')
  console.log(req)
  let data = {
    content: 'Hello, World!'
  }
  res.send(createResponse(data))
})

