const setInformationAI = require("../../ai_connection/create_information_ai");
const { GetUnInformationLessonByNameAndClass, GetLessonSubjectByID, AddInformation } = require("../../sql/lesson/lesson_process");
const bodyParser = require('body-parser')
const InformationModel = require('./../../models/information_model')
module.exports = (app) => {
    app.get('/lessons/getUnInformationLessons',async (req,res) => {
        const {lesson_type, lesson_class} = req.query;
        const lesson_data = await GetUnInformationLessonByNameAndClass(lesson_type, lesson_class)
        res.json({
            status : lesson_data.status,
            lessons : lesson_data.result
        })
    })
    app.get('/lessons/createInformationAsAI',async (req,res) => {
        const {id} = req.query;
        const lesson_process = await GetLessonSubjectByID(id)
        if (lesson_process.status) {
            const information_result = await setInformationAI(lesson_process.result);
            res.json({
                status : information_result.status,
                information : information_result.information ?? null
            })
        } else {
            res.json({
                status : false,
                error : lesson_process.error
            })
        }
    })
    app.post('/lessons/addInformation',bodyParser.json(), async (req,res) => {
        const {information, lesson_id} = req.body;
        const information_model = new InformationModel(information);
        const add_process = await AddInformation(information_model.toList(), lesson_id);
        res.json({
            status : add_process.status,
            error : !add_process.status ? add_process.error : null
        }) 
    })
}
