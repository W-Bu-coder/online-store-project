
const express = require('express')
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Service = require('./routes/service');
// random Base64 key
const JWT_SECRET = 'Tpv/yCLn0kdoE4VRTa8VmtGQGbdGQ/tFRtjlUDE7VmRhUv6cWsTIbkoXLZaYBu/y'
const port = 3036
const address = '10.147.19.129'
startServer()
const app = express()
app.use(express.json())

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

const signToken = (username, role) => {
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


app.post('/login', async (req, res) => {
  // call Service function here
  // console.log('Received: ', req.body)
  let name = req.body.username;
  let password = req.body.password;
  let { status, role } = await Service.handleLogin(name, password);
  console.log('status', status);
  if (status == 'success') {
    let token = signToken(name, role);
    const data = {
      token: 'Bearer ' + token,
      role: role
    };
    createResponse(res, data);
  }
  else {
    if (status == 'user_not_found')
      createResponse(res, null, 404001, status);
    else if (status == 'password_error')
      createResponse(res, null, 400001, status);
    else {
      createResponse(res, null, 500000, 'Server error');
    }
  }
})

app.post('/register', async (req, res) => {
  try {
    const userInfo = req.body
    const result = await Service.handleRegister(userInfo);
    console.log('result', result);

    createResponse(res, null, result.code, result.status);
    
  } catch (error) {
    console.error('Error in register controller:', error.message);
    createResponse(res, null, 500011, 'server_error');
  }
})

async function startServer() {
  try {
    await Service.initDB();

    app.use(cors());

    app.listen(port, address, () => {
      console.log(`Backend is listening on ${port}`)
    })

  } catch (error) {
    console.error(error);
  }
}

module.exports = app;


