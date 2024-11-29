const mysql = require('mysql2/promise')

class Database {
  constructor() {
    this.poolConfig = {
      host: 'sql5.freesqldatabase.com',
      user: 'sql5748294',
      password: 'VLaAadHl28',
      database: 'sql5748294',
      port: 3306,
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

  async queryUserList() {
    try {
      const [rows] = await this.pool.execute('SELECT * FROM user_info');
      const formattedData = rows.map(user => ({
        userId: user.id,
        fullName: user.name,
        email: user.email,
        address: user.address,
        city: user.city,
        province: user.province,
        postcode: user.postcode,
        role: user.role
      }));
      // console.log(JSON.stringify(formattedData));
      return formattedData;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async queryUserInfo(username) {
    try {
      const sqlStr = 'SELECT * FROM user_info WHERE name = ?'
      const row = await this.pool.execute(sqlStr, [username]);
      return row;
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async insertUserInfo(userInfo) {
    try {
        const sqlInsert = `
            INSERT INTO user_info (name, password, email, address, postcode, role, city, province) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            userInfo.username,
            userInfo.password,
            userInfo.email,
            userInfo.address,
            userInfo.postcode,
            0,
            userInfo.city,
            userInfo.province,
        ];
  
        const result = await this.pool.execute(sqlInsert, params);
        return result;
    } catch (error) {
        console.error('Failed to insert user:', error.message);
        throw new Error(error.message);
    }
  }
  
  // async getLastInsertedId() {
  //   try {
  //       const sql = 'SELECT LAST_INSERT_ID() AS userId';
  //       const result = await this.pool.execute(sql);
  //       return result[0]?.userId || null;
  //   } catch (error) {
  //       console.error('Failed to fetch last inserted ID:', error.message);
  //       throw new Error(error.message);
  //   }
  // }


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