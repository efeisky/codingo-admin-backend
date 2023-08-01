const { GetSettingByName } = require("../sql/setting/setting_process");

module.exports = (app) => {
    app.get('/getSetting',async (req,res) => {
        const {name} = req.query;
        const settings = await GetSettingByName(name);
        if (settings.status) {
            res.json({
                status : true,
                result : settings.result
            })
        } else {
            res.json({
                status : false,
                error : settings.errorId
            })
        }
    })
}
