// 用來寫User的Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    img: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    imgs: {
        type: [String],
        require: true
    },
    date: {
        type: Date,
        default:Date.now
    }
})

// model傳入兩筆資料(Collection, Schema)
module.exports = Profile = mongoose.model("profile", ProfileSchema);