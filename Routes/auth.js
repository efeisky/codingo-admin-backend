const { takePermanentToken } = require("../redis/redis_connection");
const { AdminAuthControl } = require("../sql/auth/auth_process");

module.exports = (app) => {
    app.get('/getAdminInfo',async (req,res) => {
        const {token} = req.query;
        const ip = req.ip;

        const response = await takePermanentToken(ip, token);
        if (response.status) {
            const home_process = await AdminAuthControl(response.id);
            if (!home_process.status) {
                switch (home_process.errorId) {
                    case 1:
                        res.status(500).json({
                            status: false,
                            error: 'DB Error | MySql is not working'
                        });
                        break;
                    case 2:
                        res.status(500).json({
                            status: false,
                            error: 'Connection Error | MySql is not working'
                        });
                        break;
                    case 3:
                        res.status(200).json({
                            status: false,
                            error: 'The user is not defined!'
                        });
                        break;
                }
            }else{
                return res.status(200).json({
                    status: true,
                    tokenTime: response.tokenRemaining,
                    user : home_process.result.json
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                error: 'The token is not founded!'
            });
        }
    })
}