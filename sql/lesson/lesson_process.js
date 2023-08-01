const { QuestionModel } = require('../../models/question_model');
const pool = require('../db_connection');
const { db_test_connection } = require('../db_test');

async function GetLessonByNameAndClass(lessonType, lessonClass) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    let sql;
    if (lessonType === 'math') {
      sql = 'SELECT id as lesson_id, lessonName as lesson_name, lessonSubject as lesson_subject, lessonClass as lesson_class, lessonQuestionCount as question_count FROM `table_lesson` WHERE lessonName = ? AND lessonClass = ?';
    } else {
      sql = 'SELECT id as lesson_id, lessonName as lesson_name, lessonSubject as lesson_subject, lessonClass as lesson_class, lessonQuestionCount as question_count FROM `table_lesson` WHERE lessonName = ?';
    }
    try {
      const connection = await pool.promise().getConnection();
      try {
        let lesson;
        if (lessonType === 'math') {
          lesson = await connection.execute(sql, [lessonType, parseInt(lessonClass)]);
        } else {
          lesson = await connection.execute(sql, [lessonType]);
        }
        const modeled_list = lesson[0].map((lesson_part) => {
          return new QuestionModel(lesson_part);
        })
        return {
          status: true,
          result: modeled_list
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
      errorId: 1
    };
  }
}
async function GetLessonSubjectByID(id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = ` SELECT table_lesson.lessonSubject as subject
                  FROM table_question
                  INNER JOIN table_lesson
                  ON table_question.lessonID = table_lesson.id
                  WHERE table_question.id = ?;
                `;
    try {
      const connection = await pool.promise().getConnection();
      try {
        const lesson = await connection.execute(sql, [id]);
        const subject = lesson[0][0].subject
        return {
          status: true,
          result: subject
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
      errorId: 1
    };
  }
}
async function AddQuestion(list, lesson_id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const question_sql = `INSERT INTO table_question (\`lessonID\`, \`questionContent\`, \`questionType\`, \`level\`, \`optionA\`, \`optionB\`, \`optionC\`, \`optionD\`, \`answer\`)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const lesson_sql = `UPDATE table_lesson SET lessonQuestionCount = lessonQuestionCount + 1
    WHERE id = ?;`;
    try {
      const connection = await pool.promise().getConnection();
      try {
        const connection_list = [
          lesson_id,
          ...list
        ]
        await connection.execute(question_sql, connection_list);
        await connection.execute(lesson_sql, [lesson_id]);
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
        error: 'Connection Error | MySql is not working'
      };
    }
  } else {
    return {
      status: false,
      error: 'DB Error | MySql is not working'
    };
  }
}
async function AddInformation(list, lesson_id) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `INSERT INTO table_information (\`lessonID\`, \`informationVideo\`, \`informationXML\`)
    VALUES (?, ?, ?);`;
    try {
      const connection = await pool.promise().getConnection();
      try {
        const connection_list = [
          lesson_id,
          ...list
        ]
        await connection.execute(sql, connection_list);
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
        error: 'Connection Error | MySql is not working'
      };
    }
  } else {
    return {
      status: false,
      error: 'DB Error | MySql is not working'
    };
  }
}
async function GetUnInformationLessonByNameAndClass(lessonType, lessonClass) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    let sql;
    if (lessonType === 'math') {
      sql = `
      SELECT 
      l.id AS lesson_id,
      l.lessonName AS lesson_name,
      l.lessonSubject AS lesson_subject,
      l.lessonClass AS lesson_class,
      l.lessonQuestionCount AS question_count
      FROM 
          \`table_lesson\` l
      LEFT JOIN 
      \`table_information\` i ON l.id = i.lessonID
      WHERE 
          l.lessonName = ?  AND l.lessonClass = ? AND i.lessonID IS NULL
      `;
    } else {
      sql = `
      SELECT 
      l.id AS lesson_id,
      l.lessonName AS lesson_name,
      l.lessonSubject AS lesson_subject,
      l.lessonClass AS lesson_class,
      l.lessonQuestionCount AS question_count
      FROM 
          \`table_lesson\` l
      LEFT JOIN 
      \`table_information\` i ON l.id = i.lessonID
      WHERE 
          l.lessonName = ? AND i.lessonID IS NULL
      `;
    }
    try {
      const connection = await pool.promise().getConnection();
      try {
        let lesson;
        if (lessonType === 'math') {
          lesson = await connection.execute(sql, [lessonType, parseInt(lessonClass)]);
        } else {
          lesson = await connection.execute(sql, [lessonType]);
        }
        const modeled_list = lesson[0].map((lesson_part) => {
          return new QuestionModel(lesson_part);
        })
        return {
          status: true,
          result: modeled_list
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
      errorId: 1
    };
  }
}
async function AddLesson(data) {
  const resultTest = await db_test_connection();
  if (resultTest.dbStatus) {
    const sql = `CALL AddLesson(?, ?, ?, ?);`;
    try {
      const connection = await pool.promise().getConnection();
      try {
        await connection.execute(sql, data);
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
        error: 'Connection Error | MySql is not working'
      };
    }
  } else {
    return {
      status: false,
      error: 'DB Error | MySql is not working'
    };
  }
}
module.exports = {
  GetLessonByNameAndClass,
  GetLessonSubjectByID,
  AddQuestion,
  AddInformation,
  GetUnInformationLessonByNameAndClass,
  AddLesson
};
