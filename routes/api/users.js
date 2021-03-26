// @login & register

const express = require("express");

// 透過User存取mongoDB
const User = require("../../models/User");

// 密碼加密套件
const bcrypt = require("bcrypt");

// 頭像產生套件
const gravatar = require("gravatar");

// 用來產生 Json Web Token
const jwt = require("jsonwebtoken");

// 路由套件
const router = express.Router();

// 引入自己寫的keys
const keys = require("../../config/keys");

// 登入時透過password.authenticate驗證用
const password = require("passport");

// $routes GET api/users/test
// @desc 回傳請求的JSON資料
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "login works" });
})

// $routes POST api/users/register
// @desc 回傳請求的JSON資料
// @access public
router.post("/register", (req, res) => {
    // 確認使用者是否存在，用mongo語法
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({email:"已被註冊"})
            } else {
                const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, function(err, salt){
                    bcrypt.hash(newUser.password, 10, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;
                        newUser.save()
                               .then(user => res.json(user))
                               .catch(err => console.log(err));
                    })
                })

            }
        })
})
// $routes POST api/users/login
// @desc 回傳token jwt passport
// @access public
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // 查詢資料庫中的使用者是否存在
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "使用者不存在" });
            }

            // 密碼核對
            bcrypt.compare(password, user.password)
                  .then(isMatch => {
                      if (isMatch) {
                          const rule = { id: user.id, name: user.name, avatar:user.avatar };
                          jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                              if (err) throw err;
                              res.json({
                                  success: true,
                                  token: "Bearer " + token
                              });
                          });
                        //   res.json({ msg: "success" });
                      } else {
                          return res.status(400).json({ password: "密碼錯誤" });
                      }
                  })
        })
})

// $routes GET api/users/current
// @desc return currnet user
// @access private
router.get("/current", password.authenticate("jwt",{session:false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        avatar: req.user.avatar,
        email: req.user.email
    });
})

module.exports = router;