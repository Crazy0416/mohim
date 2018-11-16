'use strict';

const userSchema = require('../models/UserSchema');
const to = require('await-to-js').default;

exports.register = async(req, res, next) => {
    //
    // let userData = {
    //     uid: req.body.uid,
    //     name: req.body.name,
    //     password: req.body.password
    // };
    //
    // let [err, userDoc] = await to(userSchema.register(userData));
    // if(err) {
    // 	err.message = "회원가입을 실패하였습니다."; throw err;
    // }
    //
    // res.json({
    //     "success": true,
    //     "code": 200,
    //     "message": "회원가입이 완료되었습니다.",
    //     "time": new Date()
    // })
    res.send("test");
};

exports.login = async(req, res, next) => {

};