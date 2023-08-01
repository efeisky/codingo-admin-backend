const bodyParser = require("body-parser")
const { LoginModel } = require("../models/login_model")
const {AdminLogin} = require("./../sql/auth/auth_process");
const { AdminLoginSecurity } = require("../mail/mail_sender");
const CreateToken = require("./../security/token");
const { getToken, getOTP, deleteValue, CreatePermanentToken } = require("../redis/redis_connection");
module.exports = (app) => {
    app.post('/login',bodyParser.json(),async (req,res) => {
        const {email, password, key} = req.body;
        if (!email || !password || !key) {
            res.status(203).json({
                status: false,
                error: 'Data Error'
            });
        }
        try {
            const user = new LoginModel(email, password, key);
            const login_process = await AdminLogin(user);
            if (!login_process.status) {
                switch (login_process.errorId) {
                    case 1:
                        res.status(500).json({
                            status : false,
                            error: 'DB Error | MySql is not working'
                        })
                    case 2:
                        res.status(500).json({
                            status : false,
                            error: 'Connection Error | MySql is not working'
                        })
                    case 3:
                        res.status(200).json({
                            status : false,
                            error: 'The user is not defined!'
                        })
                }
            }else{
                const token = CreateToken(64);
                await AdminLoginSecurity(login_process.result.id, login_process.result.mail, req.ip,token);
                res.status(200).json({
                    status : true,
                    token : token,
                    ...login_process.result.jsonFormat
                })
            }
        } catch (error) {
            res.status(410).json({
                status : false,
                error: 'Server Error'
            })
        }
    }),
    app.get('/controlToken',async (req,res) => {
        const {token, id} = req.query;
        const ip = req.ip;

        const token_values = await getToken(ip);
        const otp_values = await getOTP(id);
        res.json({
            status : token_values.token == token && token_values.isExpired && otp_values.isExpired && ip == otp_values.ip,
            otp : otp_values.otp
        })
    }),
    app.post('/setPermanentToken',bodyParser.json(),async (req,res) => {
        const {id} = req.body;
        const ip = req.ip;

        const deleteResponse = await deleteValue(id, ip);
        if (deleteResponse) {
            const tokenResponse = await CreatePermanentToken(id, ip);
            res.status(200).json({
                status : tokenResponse.is_created,
                token : tokenResponse.created_token
            });
        }else{
            res.status(500).json({
                status : false
            })
        }
    })
}