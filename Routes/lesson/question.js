const setQuestionAI = require("../../ai_connection/create_question_ai");
const { QuestionMakeModel } = require("../../models/question_model");
const { GetLessonByNameAndClass, GetLessonSubjectByID, AddQuestion } = require("../../sql/lesson/lesson_process");
const bodyParser = require('body-parser')
module.exports = (app) => {
    app.get('/lessons/getLessons',async (req,res) => {
        const {lesson_type, lesson_class} = req.query;
        const lesson_data = await GetLessonByNameAndClass(lesson_type, lesson_class)
        res.json({
            status : lesson_data.status,
            lessons : lesson_data.result
        })
    })
    app.get('/lessons/createQuestionAsAI',async (req,res) => {
        const {id} = req.query;
        const lesson_process = await GetLessonSubjectByID(id)
        if (lesson_process.status) {
            const question_result = await setQuestionAI(lesson_process.result);
            res.json({
                status : question_result.status,
                question : question_result.question ?? null
            })
        } else {
            res.json({
                status : false,
                error : lesson_process.error
            })
        }
    })
    app.post('/lessons/addQuestion', bodyParser.json(),async (req,res) => {
        const {question, lesson_id} = req.body;

        const question_model = new QuestionMakeModel(question)

        const add_process = await AddQuestion(question_model.toList(), lesson_id);

        res.json({
            status : add_process.status,
            error : !add_process.status ? add_process.error : null
        }) 
    })
}
