const mysql = require('mysql2/promise')

class Database {
  constructor() {
    // Á¬½Ó³ØÅäÖÃ
    this.poolConfig = {
      host: 'localhost',
      user: 'root',
      password: '123456',
      database: 'ECE9065',
      waitForConnections: true
    };

    this.pool = null;
  }

  async init() {
    try {
      this.pool = mysql.createPool(this.poolConfig);
      await this.pool.getConnection();
      console.log('database is connected');
    } catch (error) {
      console.error('cnnection failed: ', error);
      throw error;
    }
  }

  async queryUserInfo() {
    try {
      const [rows] = await this.pool.execute('SELECT * FROM user_info');
      const formattedData = rows.map(user => ({
        userId: user.id,
        fullName: `${user.fname} ${user.lname}`,
        email: user.email,
        address: user.address,
        city: user.city,
        province: user.province,
        postcode: user.postcode,
        role: user.role
      }));
      console.log(JSON.stringify(formattedData));
      return {
        success: true,
        data: formattedData
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async close() {
    try {
      await this.pool.end();
      console.log('connection is closed');
    } catch (error) {
      console.error('close failed:', error);
      throw error;
    }
  }
}


const db = new Database();
module.exports = db;