const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    caption: {
        type: String
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: { type:mongoose.Schema.Types.ObjectId, 
            ref: 'User'},
        text: { type:String},
        date: { type: Date, 
            default: Date.now}
    }],
    date: { type: Date, 
        default:Date.now}

});

module.exports = mongoose.model("Post", PostSchema);