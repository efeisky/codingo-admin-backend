class InformationModel {
    constructor(data) {
        const {
            video_src,
            information_content,
        } = data;

        this.video_src = video_src;
        this.information_content = information_content;
    }
    toList(){
        return [
            this.video_src,
            this.information_content
        ]
    }
}

module.exports = InformationModel