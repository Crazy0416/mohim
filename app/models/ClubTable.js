'use strict';

const to = require('await-to-js').default;
const poolCon = require('../helpers/mysqlHandler');

module.exports = {
	makeNewClub: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.clubName && dataObj.clubInfo)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();
		try {
			[rows,fields] = await connection.execute(
				`INSERT INTO Club (club_name, club_info, u_email) 
				VALUES (?, ?, ?)`, [dataObj.clubName, dataObj.clubInfo, dataObj.user.email]);
		} catch(err) {
			err.myMessage = "서버 오류. 클럽 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewClub 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	}
};