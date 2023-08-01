const pool = require('./../db_connection');
const { db_test_connection } = require('./../db_test');
const AdminModel = require('./../../models/admin_model')
const CreateToken = require('./../../security/token')
async function GetAdmin() {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = 'SELECT * FROM admin_user';
    try {
      const connection = await pool.promise().getConnection();
      try {
        const [rows] = await connection.execute(sql);
        const data = rows.map((admin) => {
            return new AdminModel(admin);
        })
        return {
            status : true,
            result : data
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

async function GetAdminByID(id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = 'SELECT * FROM admin_user WHERE id = ?';
    try {
      const connection = await pool.promise().getConnection();
      try {
        const [rows] = await connection.execute(sql, [id]);
        const data = new AdminModel(rows[0]);
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

async function ChangeAdminStatusByID(id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `
    UPDATE admin_user
    SET admin_status = CASE
        WHEN admin_status = 1 THEN 0
        WHEN admin_status = 0 THEN 1
        ELSE admin_status
    END
    WHERE id = ?;
    `;
    try {
      const connection = await pool.promise().getConnection();
      try {
        await connection.execute(sql, [id]);
        return {
          status: true,
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

async function ChangeAdminKeyByID(id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `
    UPDATE admin_user
    SET admin_key = ?
    WHERE id = ?;
    `;
    try {
      const connection = await pool.promise().getConnection();
      try {
        const newKey = CreateToken(256);
        await connection.execute(sql, [newKey,id]);
        return {
          status: true,
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
async function AddAdmin(data) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `
    INSERT INTO admin_user (\`unique_id\`, \`admin_level\`, \`admin_name\`, \`admin_email\`, \`admin_password\`, \`admin_key\`, \`admin_phone_number\`, \`admin_status\`)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    try {
      const connection = await pool.promise().getConnection();
      try {
        await connection.execute(sql, data);
        return {
          status: true,
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
async function DeleteAdmin(id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `
    DELETE FROM admin_user WHERE id = ?
    `;
    try {
      const connection = await pool.promise().getConnection();
      try {
        await connection.execute(sql, [id]);
        return {
          status: true,
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
    GetAdmin,
    GetAdminByID,
    ChangeAdminStatusByID,
    ChangeAdminKeyByID,
    AddAdmin,
    DeleteAdmin
}