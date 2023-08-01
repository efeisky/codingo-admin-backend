const bodyParser = require('body-parser')
const { GetAdmin, GetAdminByID, ChangeAdminStatusByID, ChangeAdminKeyByID, AddAdmin, DeleteAdmin} = require('../../../sql/admin/admin_process');
const AdminModel = require('../../../models/admin_model');
const SetUserKeys = require('../../../security/key');
module.exports = (app) => {
    app.get('/admin/getAdmin',async (req,res) => {
        const admin_data = await GetAdmin();
        res.json({
            status : admin_data.status,
            result : admin_data.result,
        })
    })
    app.get('/admin/detailAdmin',async (req,res) => {
        const {id} = req.query;
        const admin_data = await GetAdminByID(id);
        if (admin_data.status) {
            res.json({
                status : true,
                result : admin_data.result
            })
        } else {
            res.json({
                status : false,
                error : admin_data.errorId
            })
        }
    })
    
    app.patch('/admin/changeStatus', bodyParser.json(),async (req,res) => {
        const {id} = req.body;
        const admin_data = await ChangeAdminStatusByID(id);
        if (admin_data.status) {
            res.json({
                status : true
            })
        } else {
            res.json({
                status : false,
                error : admin_data.errorId
            })
        }
    })
    
    app.patch('/admin/changeKey', bodyParser.json(),async (req,res) => {
        const {id} = req.body;
        const admin_data = await ChangeAdminKeyByID(id);
        if (admin_data.status) {
            res.json({
                status : true
            })
        } else {
            res.json({
                status : false,
                error : admin_data.errorId
            })
        }
    })
    app.post('/admin/add', bodyParser.json(),async (req,res) => {
        const user = new AdminModel(req.body);
        SetUserKeys(user)
        const add_admin = await AddAdmin([
            user.unique_id,
            user.admin_level,
            user.admin_name,
            user.admin_email,
            user.admin_password,
            user.admin_key,
            user.admin_phone_number,
            user.admin_status,
        ])
        res.json({
            status : add_admin.status
        })
    })

    app.delete('/admin/delete',async (req,res) => {
        const id = parseInt(req.query.id);
        const delete_process = await DeleteAdmin(id);
        res.json({
            status : delete_process.status,
            error : delete_process.errorId
        })
    })
}
