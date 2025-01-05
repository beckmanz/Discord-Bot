const { Schema, model} = require('mongoose');

const UserVipSchema = new Schema({
    _id: String,
    userId: String,
    expirationDate: Date,
    channelId: String,
    roleId: String
})

module.exports = model("userVip", UserVipSchema);