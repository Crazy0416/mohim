'use strict';

const poolCon = require('../helpers/mysqlHandler');
const ClubTable = require('./ClubTable');

module.exports = {
	addClubMemberSQL: `INSERT INTO ClubMembers (c_club_name, u_email)
				VALUES (?, ?)`,
	addClubMember: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.clubName)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.addClubMemberSQL, [dataObj.clubName, dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 클럽 멤버 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("클럽에 멤버 추가 결과: %o", rows);

		try {
			[rows,fields] = await connection.execute(`UPDATE Club SET user_count=user_count+1 WHERE club_name=?`, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 클럽 멤버 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("클럽 유저 수 증가 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	}
};