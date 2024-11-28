
const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Service = require('./service');
// random Base64 key
const JWT_SECRET = 'Tpv/yCLn0kdoE4VRTa8VmtGQGbdGQ/tFRtjlUDE7VmRhUv6cWsTIbkoXLZaYBu/y'
const port = 3036
const address = '10.147.19.129'
startServer()
const app = express()

const createResponse = (res, data, code = 200, message = "success") => {
  const response = {
    code,
    message,
    data: data || null
  };
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  // console.log(JSON.stringify(response))
  res.json(response);
}

const JWToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ message: 'No token or token invalid' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'No token or token invalid' });
    }
    req.user = user;
    next();
  });
};

const signToken = (name, role) => {
  const payload = {
    username: username,
    role: role,
  };

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '24h'
    }
  );
  return token
}
// app.get('/hello', (req, res) => {
//   console.log('Received: ')
//   console.log(req)
//   let data = {
//     content: 'Hello, World!'
//   }
//   res.send(createResponse(data))
// })

app.get('/user/list', async (req, res) => {
  let data = await Service.getUsersInfo()
  createResponse(res, data)
})


app.post('/login', (req, res) => {
  // call Service function here
  let name = req.username;
  let role = req.role;
  const token = signToken(name, role)
  createResponse(data)
})

app.post('/register', (req, res) => {
  // call Service function here
  createResponse(data)
})





async function startServer() {
  try {
    await Service.initDB();
    // alow local test
    app.use(cors({
      origin: 'http://localhost:3000'
    }));

    app.listen(port, address, () => {
      console.log(`Backend is listening on ${port}`)
    })

  } catch (error) {
    console.error(error);
  }
}


