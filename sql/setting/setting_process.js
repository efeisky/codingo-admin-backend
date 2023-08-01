const pool = require('./../db_connection');
const { db_test_connection } = require('./../db_test');
const SettingModel= require('./../../models/setting_model')
async function GetSettingByName(name) {
    const resultTest = await db_test_connection();
    if (resultTest.dbStatus) {
      let sql = 'SELECT * FROM admin_user Where admin_name = ? && admin_status = 1';
      try {
        const connection = await pool.promise().getConnection();
        try {
          const [rows] = await connection.execute(sql, [name]);
          const data = new SettingModel(rows[0]);
          return {
            status: true,
            result: data,
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
    GetSettingByName,
}