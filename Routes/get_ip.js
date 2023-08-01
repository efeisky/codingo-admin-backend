module.exports = (app) => {
    app.get('/getIp',async (req,res) => {
        res.json({ip : req.ip})
    })
}
