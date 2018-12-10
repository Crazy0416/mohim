'use strict';

const to = require('await-to-js').default;
const poolCon = require('../helpers/mysqlHandler');

module.exports = {
	registerSQL: `INSERT INTO User (uname, email, pwd) VALUES (?, ?, ?)`,
	loginSQL: `SELECT * 
				FROM User
				WHERE email=? AND pwd=?`,
	selectUserClubList: `SELECT c.club_name, c.club_info, c.u_email, c.user_count, c.penalty 
	FROM ClubMembers cm, Club c WHERE cm.u_email=? AND cm.c_club_name=c.club_name`,
	chargeCyberMoneySQL: `UPDATE User SET cyber_money = cyber_money+? WHERE email = ?`,
	selectUserInfo: `SELECT * FROM User Where email=?`,
	register: async function(dataObj) {
		if(!(dataObj && dataObj.name && dataObj.email && dataObj.password)){
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("register: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();
		try {
			[rows,fields] = await connection.execute(this.registerSQL, [dataObj.name, dataObj.email, dataObj.password]);
		} catch(err) {
			err.myMessage = "서버 오류. 회원가입 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("회원가입 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	},
	login: async function(dataObj) {
		if(!(dataObj && dataObj.email && dataObj.password)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.loginSQL, [dataObj.email, dataObj.password]);
		} catch (err) {
			err.myMessage = "서버 오류. 회원가입 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("로그인 결과: %o", rows);

		if(rows.length !== undefined && rows.length <= 0) {
			await connection.rollback(); await connection.release();
			throw new Error("계정을 찾을 수 없습니다.");
		}

		await connection.commit();
		await connection.release();
		return [rows, fields];
	},
	viewUserClubList: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectUserClubList, [dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 가입된 클럽 목록 가져오기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("가입된 클럽 목록 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	},
	chargeCyberMoney: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.chargeMoney !== undefined && dataObj.chargeMoney > 0)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.chargeCyberMoneySQL, [dataObj.chargeMoney, dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 사이버 머니 충전 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("사이버 머니 충전 결과: %o", rows);

		await connection.commit();
		await connection.release();

		connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectUserInfo, [dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 사이버 머니 충전 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("유저 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	}
};