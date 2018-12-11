'use strict';

const config = require('../../config/config');
const poolCon = require('../helpers/mysqlHandler');
const moment = require('moment');

module.exports = {
	selectClubByClubNameEmail: `SELECT club_name FROM Club Where club_name=? AND u_email=?`,
	createNewAttendSQL: `INSERT INTO Notice (c_club_name, title, content, create_on) VALUES (?,?,?,?)`,
	selectNoticeInfoByClubName: `SELECT * FROM Notice WHERE c_club_name=?`,
	selectNoticeInfoById: `SELECT * FROM Notice WHERE _id=?`,
	makeNewNotice: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj.title && dataObj.clubName && dataObj.content)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectClubByClubNameEmail, [dataObj.clubName, dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 공지 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewNotice 클럽 검색 결과: %o", rows);

		if(rows.length === 0) {
			let err = new Error("클럽이 없거나 권한이 없습니다.");
			await connection.rollback(); await connection.release(); throw err;
		}

		try {
			let createOn = moment().format(config.DATE_FORMAT).toString();
			[rows,fields] = await connection.execute(this.createNewAttendSQL,
				[dataObj.clubName, dataObj.title, dataObj.content, createOn]);
		} catch (err) {
			err.myMessage = "서버 오류. 공지 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewNotice 공지 Insert 결과: %o", rows);

		await connection.commit();
		await connection.release();

		connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectNoticeInfoById, [rows.insertId]);
		} catch (err) {
			err.myMessage = "서버 오류. 공지 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewNotice 생성된 공지 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	},
	searchNoticeByClubName: async function (dataObj) {
		if(!(dataObj && dataObj.clubName)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("login: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectNoticeInfoByClubName, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 공지 리스트 가져오기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchNoticeByClubName 공지 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	}
};