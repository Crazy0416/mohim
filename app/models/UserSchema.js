'use strict';

const to = require('await-to-js').default;
const poolCon = require('../helpers/mysqlHandler');

module.exports = {
	register: async function(dataObj) {
		if(!(dataObj && dataObj.name && dataObj.email && dataObj.password))
			throw new Error("회원가입에 필요한 데이터가 없습니다.");

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

		await connection.commit();
		await connection.release();
		return [rows, fields];
	}
};