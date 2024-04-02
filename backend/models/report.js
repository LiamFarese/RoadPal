const mongoose = require("mongoose")

const reportSchema = new mongoose.Schema({
    Longitude: {
        type:Number,
        required: true
    },
    Latitude: {
        type: Number,
        required: true
    },
    ReportType: {
        type: String,
        required: true,
        enum: ['flood', 'fire', 'tornado', 'blockage', 'earthquake', 'hurricane']
    },
    StartDate: {
        type: Date,
        required: true,
        immutable: true,
        default: Date.now,
        expires: '1d'
    },
})

module.exports = mongoose.model("report", reportSchema)