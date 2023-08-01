class LessonModel {
    constructor(data) {
        const {
            lesson_type,
            lesson_class,
            lesson_subject
        } = data;

        this.type = lesson_type;
        this.class = lesson_type == 'math' ? lesson_class : 0;
        this.subject = lesson_subject;
        this.question_count = 0;
    }

    toList(){
        return [
            this.type,
            this.class,
            this.subject,
            this.question_count
        ]
    }
}

module.exports = LessonModel