const AdminModel = require("../models/admin_model");
const CreateToken = require("./token");
const CreateUniqueID = require("./uuid");

function SetUserKeys(user) {
    if (user instanceof AdminModel) {
        user.admin_key = CreateToken(256);
        user.unique_id = CreateUniqueID();
    }
    
}

module.exports = SetUserKeys;