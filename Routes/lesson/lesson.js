const bodyParser = require('body-parser')
const LessonModel = require('./../../models/lesson_model')
const { AddLesson } = require('../../sql/lesson/lesson_process')
module.exports = (app) => {
    app.post('/lessons/addLesson',bodyParser.json(), async (req,res) => {
        const lesson = new LessonModel(req.body)
        const lesson_response = await AddLesson(lesson.toList());
        res.json({
            status : lesson_response.status,
            error : lesson_response.error
        })
    })
}
