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

    res.json({
	    "message": "회원가입 완료.",
	    "code": 200,
	    "time": new Date(),
	    "data": rows[0]
    });
};

exports.login = async(req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		email: req.body.email,
		password: req.body.password
	};

	logger.debug("로그인 입력값: %o", dataObj);

	try {
		[rows, fields] = await UserSchema.login(dataObj);
	} catch (err) {
		logger.error("서버 오류. 로그인 실패: %o", err); throw err;
	}

	res.json({
        "message": "로그인 완료.",
        "code": 200,
        "time": new Date(),
        "data": rows[0]
    });
};