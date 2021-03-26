const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入user.js
const users = require("./routes/api/users");

// DB Config
const db = require("./config/keys").mongoURI;

// 使用bodyParser的方法
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// passport初始化
app.use(passport.initialize());

// 將passport傳遞到config裡面進行處理
require("./config/passport")(passport);

// Connect to mongodb
mongoose.connect(db,{ useUnifiedTopology: true , useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World");
})

// 使用routes
app.use("/api/users", users);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})