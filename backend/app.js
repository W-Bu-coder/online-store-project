
const express = require('express')
const cors = require('cors');
const Service = require('./service');
const app = express()
const port = 3036

const createResponse = (data, code = 200, message = "success") => {
  return {
    code,
    message,
    data
  }
}
// app.get('/hello', (req, res) => {
//   console.log('Received: ')
//   console.log(req)
//   let data = {
//     content: 'Hello, World!'
//   }
//   res.send(createResponse(data))
// })

app.get('/users/list', (req, res) => {
  let data = Service.getUsers()
  res.send(createResponse(data))
})

async function startServer() {
  try {
    await Service.initDB();

    app.use(cors({
      origin: 'http://localhost:3000' // frontend url
    }));

    app.listen(port, () => {
      console.log(`Backend is listening on ${port}`)
    })

  } catch (error) {
    console.error(error);
  }
}

startServer()
