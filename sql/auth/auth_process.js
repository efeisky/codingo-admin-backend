const pool = require('./../db_connection');
const { db_test_connection } = require('./../db_test');

async function AdminLogin(model) {
  const { LoginModel, LoginResponseModel } = require('./../../models/login_model');
  if (!(model instanceof LoginModel)) {
    throw new Error('Geçersiz Model Türü!');
  }
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = 'CALL AuthenticateAdminUser(?, ?, ?, ?)';
    try {
      const connection = await pool.promise().getConnection();
      try {
        const [rows] = await connection.execute(sql, [
          model.email,
          model.password,
          model.customKey,
          model.status,
        ]);
        const data = rows[0][0];
        if (data) {
          const user = new LoginResponseModel(data.name, data.access_level, data.admin_id, data.email);
          return {
            status: true,
            result: user
          };
        }else{
          return {
            status: false,
            errorId: 3,
          };
        }
      } finally {
        connection.release();
      }
    } catch (err) {
      return {
        status: false,
        errorId: 2,
      };
    }
  } else {
    return {
      status: false,
      errorId : 1
    };
  }
};
async function AdminAuthControl(id) {
  const { AccessModel } = require('./../../models/access_model');
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = 'CALL GetAdminAccessLevel(?);';
    try {
      const connection = await pool.promise().getConnection();
      try {
        const [rows] = await connection.execute(sql, [
          id,
        ]);
        const data = rows[0][0];
        const model = new AccessModel(data.name, data.accessLevel)
        return {
          status: true,
          result: model,
        };
      } finally {
        connection.release();
      }
    } catch (err) {
      return {
        status: false,
        errorId: 2,
      };
    }
  } else {
    return {
      status: false,
      errorId : 1
    };
  }
};
module.exports = {
    AdminLogin,
    AdminAuthControl
}