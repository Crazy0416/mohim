'use strict';

const to = require('await-to-js').default;
const poolCon = require('../helpers/mysqlHandler');

module.exports = {
	register: async function(dataObj) {
		if(!(dataObj && dataObj.name && dataObj.email && dataObj.password))
			throw new Error("잘못된 입력입니다.");

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();
		try {
			[rows,fields] = await connection.execute(
				`INSERT INTO User (uname, email, pwd) 
				VALUES (?, ?, ?)`, [dataObj.name, dataObj.email, dataObj.password]);
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
		if(!(dataObj && dataObj.email && dataObj.password))
			throw new Error("잘못된 입력입니다.");

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(
				`SELECT * 
				FROM User
				WHERE email=? AND pwd=?`, [dataObj.email, dataObj.password]);
		} catch (err) {
			err.myMessage = "서버 오류. 회원가입 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("로그인 결과: %o", rows);

		logger.debug("로그인 실패 조건: %s %s %s", rows.length, rows.length <= 0, rows.length && rows.length <= 0);
		if(rows.length !== undefined && rows.length <= 0) {
			await connection.rollback(); await connection.release();
			throw new Error("계정을 찾을 수 없습니다.");
		}

		await connection.commit();
		await connection.release();
		return [rows, fields];
	}
};