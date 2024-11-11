const { Schema, model} = require('mongoose');

const verificationSchema = new Schema({
    _id: String,
    configuration: {
        channel: String,
        roleAdd: String,
        roleRemove: String,
        roleAuthorizer: String,
        embedMessage: String,
        authorizerMessage: String,
    }
})

module.exports = model("Verification", verificationSchema);