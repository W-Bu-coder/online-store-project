const db = require('./database');

class Service {
  static async initDB() {
    await db.init()
  }

  static async getUsersInfo() {
    const users = await db.queryUserList();
    // console.log('getUsers:' + users);
    return users;
  }

  static async handleLogin(username, password) {

    const [results] = await db.queryUserInfo(username);

    // not exist
    if (results.length === 0)
      return {
        status: 'user_not_found',
        role: -1
      }

    const compareResult = (password == results[0].password);
    console.log('login user:', username)
    console.log('password:', password)

    if (compareResult) {
      let role = results[0].role;
      return {
        status: 'success',
        role: role
      };
    }
    else
      return {
        status: 'password_error',
        role: -1
      };
  }
}

module.exports = Service;