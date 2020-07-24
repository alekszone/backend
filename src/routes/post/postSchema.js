const { Schema } = require("mongoose")
const mongoose = require("mongoose")


const post = new Schema({
    text: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    user: [{
        type: Schema.Types.ObjectId, ref: "profiles"
    }],
    image: {
        type: String,

    },
},
    {
        timestamps: true
    })
post.static("addProfile", async function (id) {
    const profile = await PostsModel.findOne({ _id: id }).populate("user")
    return profile
})

module.exports = mongoose.model("posts", post)