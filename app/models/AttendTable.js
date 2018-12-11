'use strict';

const config = require('../../config/config');
const poolCon = require('../helpers/mysqlHandler');
const moment = require('moment');

module.exports = {
	createNewAttendSQL: `INSERT INTO Attend (c_club_name, title, deadline, create_on, code) 
	Values (?, ?, ?, ?, ?)`,
	selectClubByClubNameEmail: `SELECT club_name FROM Club Where club_name=? AND u_email=?`,
	selectAttendInfoById: `SELECT * FROM Attend WHERE _id=?`,
	selectAttendListByClubName: `SELECT * FROM Attend WHERE c_club_name=?`,
	makeNewAttend: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.title && dataObj.clubName && dataObj.deadline
		&& moment(dataObj.deadline).isValid() && dataObj.code)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectClubByClubNameEmail, [dataObj.clubName, dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewAttend 클럽 검색 결과: %o", rows);

		if(rows.length === 0) {
			let err = new Error("클럽이 없거나 권한이 없습니다.");
			await connection.rollback(); await connection.release(); throw err;
		}

		try {
			let createOn = moment().format(config.DATE_FORMAT).toString();
			[rows,fields] = await connection.execute(this.createNewAttendSQL,
				[dataObj.clubName, dataObj.title, dataObj.deadline.toString(), createOn, dataObj.code]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewAttend 클럽 Insert 결과: %o", rows);

		await connection.commit();
		await connection.release();

		connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectAttendInfoById, [rows.insertId]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewAttend 출석 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	},
	searchAttendByClubName: async function (dataObj) {
		if(!(dataObj && dataObj.clubName)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectAttendListByClubName, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 리스트 가져오기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchAttendByClubName 클럽 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	}
};