'use strict';

const poolCon = require('../helpers/mysqlHandler');
const ClubMembersTable = require('./ClubMembersTable');

module.exports = {
	selectClubByClubNameSQL: `SELECT * FROM Club WHERE club_name=?`,
	makeNewClubSQL: `INSERT INTO Club (club_name, club_info, u_email) VALUES (?, ?, ?)`,
	makeNewClub: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.clubName && dataObj.clubInfo)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {   // club_name 존재 검색
			[rows,fields] = await connection.execute(this.selectClubByClubNameSQL, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 클럽 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewClub 클럽 검색 결과: %o", rows);

		if(rows.length !== undefined && rows.length > 0) {
			let err = new Error("존재하는 클럽 이름입니다.");
			err.code = 400;
			await connection.release();
			throw err;
		}

		try {   // 새 Club 생성
			[rows,fields] = await connection.execute(this.makeNewClubSQL, [dataObj.clubName, dataObj.clubInfo, dataObj.user.email]);
		} catch(err) {
			err.myMessage = "서버 오류. 클럽 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("새 클럽 만들기 결과: %o", rows);

		try {   // ClubMembers에 추가.
			[rows,fields] = await connection.execute(ClubMembersTable.addClubMemberSQL, [dataObj.clubName, dataObj.user.email]);
		} catch(err) {
			err.myMessage = "서버 오류. 클럽 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("ClubMembers에 방장 추가 결과: %o", rows);

		await connection.commit();
		await connection.release();
		return [rows, fields];
	},
	viewClubList: async function (dataObj) {
		if(!(dataObj && dataObj.page !== undefined)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("viewClubList: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		const connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			// TODO: Club 생성일을 만들 것인가? 아니면 검색어를 무조건 입력하도록 할까??
			// TODO: this 객체에 SQL 프로퍼티 만들기.
			[rows,fields] = await connection.execute(
				`SELECT *
				FROM Club 
				LIMIT 10 OFFSET ? ROWS`, [dataObj.page * 10]);
		} catch (err) {
			err.myMessage = "서버 오류. 클럽 목록 검색 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("viewClubList 클럽 검색 결과: %o", rows);

		return [rows, fields];
	}
};