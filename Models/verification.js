const { Schema, model} = require('mongoose');

const verificationSchema = new Schema({
    _id: String,
    configuration: {
        channel: String,
        roleAdd: String,
        roleRemove: String,
        roleAuthorizer: String,
        category: String,
        embed:{
            title: String,
            description: String,
        }
    }
})

module.exports = model("Verification", verificationSchema);