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

  static async handleRegister(userInfo) {
    // try {
      // if (!userInfo.username) {
      //   return { status: 'username_is_empty', code: 400015 };
      // }

      // username can not repeat
      const [rows] = await db.queryUserInfo(userInfo.username);
      if (rows && rows.length > 0) {
        return { status: 'name_already_exist', code: 400011 };
      }

      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(userInfo.email)) {
        return { status: 'email_illegal', code: 400013 };
      }

      const postcodeRegex = /^[A-Za-z]\d[A-Za-z]\d[A-Za-z]\d$/;
      if (!postcodeRegex.test(userInfo.postcode)) {
        return { status: 'postcode_illegal', code: 400014 };
      }

      // // 加密密码
      // userInfo.password = bcrypt.hashSync(userInfo.password, 10);

      // 调用 db 插入用户信息
      try {
        const insertResult = await db.insertUserInfo(userInfo);
        console.log('insert result: ', insertResult)
        return { status: 'success', code: 200 };
      } catch (error) {
        console.error('Error in handleRegister:', error.message);
        return { status: 'server_error', code: 500 };
      }
      

  //     // 检查插入是否成功
  //     if (insertResult.affectedRows === 1) {
  //       const userId = await db.getLastInsertedId();
  //       return {
  //         status: 'success',
  //         data: {
  //           userId,
  //           username: userInfo.username,
  //           email: userInfo.email,
  //           address: userInfo.address,
  //           postcode: userInfo.postcode,
  //           role: 0, // 默认角色
  //           city: userInfo.city,
  //           province: userInfo.province,
  //         },
  //       };
  //     } else {
  //       return { status: 'register_failed', code: 500 };
  //     }
  //   } catch (error) {
  //     console.error('Error in handleRegister:', error.message);
  //     return { status: 'server_error', code: 500 };
  // }
  }

}

module.exports = Service;