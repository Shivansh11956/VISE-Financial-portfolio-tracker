const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

const trackedFixedSchema = mongoose.Schema({
    userName : String,
    fdName : String,
    fdType : String,
    maturityPeriod : String,
    date : Date,
    fdInvestment : Number,
    interestRate : Number,
    status : Number,
    lastLog : String,
    lastUpdated : String
})

module.exports = mongoose.model("trackedfixed",trackedFixedSchema)