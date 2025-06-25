const { name } = require('ejs')
const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

const helpSchema = mongoose.Schema({
    user : String,
    firstName : String,
    lastName : String,
    email : String,
    countryCode : String,
    phoneNumber : Number,
    description : String
})

module.exports = mongoose.model("help",helpSchema)