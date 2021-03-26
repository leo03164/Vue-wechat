// 用來寫User的Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default:Date.now
    }
})

// model傳入兩筆資料(Collection, Schema)
module.exports = User = mongoose.model("users", UserSchema);