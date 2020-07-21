const { Schema } = require("mongoose")
const mongoose = require("mongoose")

const experienceSchema = new Schema(
    {

        role: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        startDate: String,
        endDate: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        area: String,
        username: String,

        image: String,


    },
    {
        timestamps: true
    }

)
module.exports = mongoose.model("Experiences", experienceSchema)