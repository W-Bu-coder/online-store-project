const jwt = require('jsonwebtoken')
// random Base64 key
const JWT_SECRET = 'Tpv/yCLn0kdoE4VRTa8VmtGQGbdGQ/tFRtjlUDE7VmRhUv6cWsTIbkoXLZaYBu/y'

const signToken = (username, role) => {
  const payload = {
    username: username,
    role: role,
  }

  const token = jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: '12h'
    }
  )
  return token
}

// Not REST compliant, deprecated
// const blackToken = async (token) => {
//   try {
//     const decoded = jwt.decode(token);
//     if (!decoded || !decoded.exp) {
//       return res.status(400).json({ message: 'Invalid token' });
//     }
//     const timeToExpire = decoded.exp - Math.floor(Date.now() / 1000);

//     await this.redisSet(token, 'blacklisted', 'EX', timeToExpire);
//     return true;
//   } catch (error) {
//     console.error('Logout error:', error);
//   }
// }

const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(403).json({ message: 'Invalid request, please log in' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid request, please log in' })
    }
    req.user = user
    next()
  })
}

const checkRole = () => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Invalid request, please log in' })
    }

    if (req.user.role !== 1) {
      return res.status(403).json({
        message: 'You have no authoration to visit this page'
      })
    }
    next()
  }
}

module.exports = {
  signToken,
  checkToken,
  checkRole
}