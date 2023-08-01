const pool = require('./db_connection');

module.exports.db_test_connection = async function () {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject({ dbStatus: 0 });
      } else {
        connection.release();
        resolve({ dbStatus: 1 });
      }
    });
  });
};
