const db = require('./database');

class Service {
  static async initDB() {
    await db.init()
  }

  static async getUsersInfo() {
    const users = await db.queryUserInfo();
    // console.log('getUsers:' + users);
    return users;
  }

  // add more methods here
}

module.exports = Service;