'use strict';

const UserSchema = require('../models/UserTable');
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

exports.viewUserClubList = async function (req, res, next) {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user
	};

	logger.debug("가입된 클럽 목록 입력값: %o", dataObj);

	try {
		[rows, fields] = await UserSchema.viewUserClubList(dataObj);
	} catch (err) {
		logger.error("서버 오류. 가입된 클럽 목록 가져오기 실패: %o", err); throw err;
	}

	res.json({
		"message": " 가입된 클럽 목록 가져오기 완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};

exports.chargeCyberMoney = async (req, res, next) => {
	let [rows, fields] = [null, null];
	let dataObj = {
		user: req.body.user,
		chargeMoney: req.body.chargeMoney
	};
	logger.debug("유저 사이버머니 충전 입력값: %o", dataObj);

	try {
		[rows, fields] = await UserSchema.chargeCyberMoney(dataObj);
	} catch (err) {
		logger.error("서버 오류. 가입된 클럽 목록 가져오기 실패: %o", err); throw err;
	}

	res.json({
		"message": "사이버 머니 충전완료.",
		"code": 200,
		"time": new Date(),
		"data": rows
	});
};