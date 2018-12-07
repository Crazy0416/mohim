'use strict';

const UserSchema = require('../models/UserSchema');
const to = require('await-to-js').default;

exports.register = async(req, res, next) => {
    let [rows, fields] = [null, null];
    let dataObj = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password
    };

    try {
	    [rows, fields] = await UserSchema.register(dataObj);
    } catch (err) {
        logger.error("회원가입 실패: %o", err); throw err;
    }

    logger.debug("register: rows: %o", rows);

    res.send("test");
};

exports.login = async(req, res, next) => {

};