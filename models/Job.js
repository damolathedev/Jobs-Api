const mongoose = require('mongoose')


const JobSchema = mongoose.Schema({
    company:{
        type: String,
        required: [true, "Please provide company name"],
        maxlength: [50, "Company name must not be more than 50 characters"]
    },
    position:{
        type:String,
        required:[true, "Please provide position"],
        maxlength:[100, "position must not be more than 100 characters"]
    },
    status:{
        type:String,
        enum:["Interview", "Declined", "Pending"],
        default: "Pending"
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required:[true, "Please provide user"]
    }
}, {timestamps: true})

module.exports = mongoose.model("JobSchema", JobSchema)