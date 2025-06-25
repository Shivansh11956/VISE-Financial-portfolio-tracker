const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/vise`)

let trackedFundSchema = mongoose.Schema({
    name : String,
    amcName : String,
    fundCode : Number,
    targetNAV : Number,
    status : Number,
    latestLog : String,
    lastUpdated : Date,
    email : String
})

module.exports = mongoose.model('trackedFund',trackedFundSchema)