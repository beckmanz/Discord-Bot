const { Schema, model} = require('mongoose');

const requestSchema = new Schema({
    _id: String,
    channel: String,
    requester: String,
    requested: String,
})

module.exports = model("Request", requestSchema);