// @login & register
const express = require("express");
const router = express.Router();
const keys = require("../../config/keys");
const password = require("passport");

const Profile = require("../../models/Profile");

// $routes GET api/profiles/test
// @desc 回傳請求的JSON資料
// @access public
router.get("/test", (req, res) => {
    res.json({ msg: "profiles works" });
})
 
// $routes POST api/profiles/add
// @desc 創建好友訊息介面
// @access private
router.post("/add", password.authenticate("jwt", { session: false }), (req, res) => {
    const profilesFields = {};
    if (req.body.img) profilesFields.img = req.body.img;
    if (req.body.name) profilesFields.name = req.body.name;
    if (req.body.text) profilesFields.text = req.body.text;

    if (req.body.imgs) {
        profilesFields.imgs = req.body.imgs.split("|");
    }
    
    new Profile(profilesFields).save().then(profile => {
        res.json(profile);
    })
    // res.json({ msg: "profiles works" });
})

// $routes get api/profiles/latest
// @desc 下拉加載
// @access private
router.get("/latest", password.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find()
        .sort({ date: -1 })
        .then(profiles => {
            if (!profiles) {
                res.status(404).json("沒有任何消息");
            } else {
                let newProfiles = [];

                for (let i = 0; i < 3; i++){
                    if (profiles[i] != null) {
                        newProfiles.push(profiles[i]);
                    }
                }
                res.json(newProfiles);
            }
        })
})

// $routes get api/profiles/:page/:size
// @desc 上拉加載
// @access private
router.get("/:page/:size", password.authenticate("jwt", { session: false }), (req, res) => {
    Profile.find()
        .sort({ date: -1 })
        .then(profiles => {
            if (!profiles) {
                res.status(404).json("沒有任何消息");
            } else {
                let size = req.params.size;
                let page = req.params.page;

                // 取得當前位置
                let index = size * (page - 1);

                let newProfiles = [];

                for (let i = index; i < size * page; i++){
                    if (profiles[i] != null) {
                        newProfiles.unshift(profiles[i]);
                    }
                }
                res.json(newProfiles);
            }
        })
})
 

module.exports = router;