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
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        description: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },

        image: {
            type: String
        },


    },
    {
        timestamps: true
    }

)
module.exports = mongoose.model("Experiences", experienceSchema)