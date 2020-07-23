const { Schema, model } = require("mongoose")
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
            type: String
        },

        image: {
            type: String
        },


    },
    {
        timestamps: true
    }

)

const experienceModel = model("Experience", experienceSchema)
module.exports = experienceModel