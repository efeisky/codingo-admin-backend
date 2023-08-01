
const pool = require('./../db_connection');
const { db_test_connection } = require('./../db_test');

async function GetReports(reportType, readStatus) {
    const resultTest = await db_test_connection();
    if (resultTest.dbStatus) {
      let sql;
      if (reportType == 'profile') {
        sql = 'CALL GetProfileReportsForAdmin(?);';
      }else{
        sql = 'CALL GetContactReportsForAdmin(?);';
      }
      try {
        const connection = await pool.promise().getConnection();
        try {
          const [rows] = await connection.execute(sql, [readStatus]);
          const data = rows[0];
          let list = [];
          if (reportType == 'profile') {
            const { ProfileReportListModel, ProfileReportModel } = require('./../../models/report_model');
            list = new ProfileReportListModel(data).toJson();
          }else{
            const { ContactReportListModel } = require('./../../models/report_model');
            list = new ContactReportListModel(data).toJson();
          }
          return {
            status: true,
            result: list,
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
  
async function GetReportById(reportType, reportId) {
    const resultTest = await db_test_connection();
    if (resultTest.dbStatus) {
      let sql;
      if (reportType == 'profile') {
        sql = 'CALL GetProfileReportDetailById(?);';
      }else{
        sql = 'CALL GetContactReportDetailById(?);';
      }
      try {
        const connection = await pool.promise().getConnection();
        try {
          const [rows] = await connection.execute(sql, [reportId]);
          const data = rows[0][0];
          if (data) {
            let model_data;
            if (reportType == 'profile') {
              const { ProfileReportModel } = require('./../../models/report_model');
              model = new ProfileReportModel(data).toJson;
              model_data = {
                ...model,
                complainingEmail : data.complaining_email,
                complainedEmail : data.complained_email,
              }
            }else{
              const { ContactReportModel } = require('./../../models/report_model');
              model_data = new ContactReportModel(data).toJson;
            }
            return {
              status: true,
              result: model_data,
            };
          }else{
            return{
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
  
async function ChangeReportStatusById(reportType, reportId, changedStatus) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    let sql;
    if (reportType == 'profile') {
      sql = 'UPDATE `table_report` SET `status`= ? WHERE id = ?';
    }else{
      sql = 'UPDATE `table_contact` SET `status`=? WHERE id=?';
    }
    try {
      const connection = await pool.promise().getConnection();
      try {
        await connection.execute(sql, [changedStatus, reportId]);
        return {
          status: true
        };
      } catch (error) {
        return {
          status: false,
          error: error.message
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
    GetReports,
    GetReportById,
    ChangeReportStatusById
}