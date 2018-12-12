'use strict';

const config = require('../../config/config');
const poolCon = require('../helpers/mysqlHandler');
const moment = require('moment');

module.exports = {
	createNewAttendSQL: `INSERT INTO Attend (c_club_name, title, deadline, create_on, code, unread_email_list) 
	Values (?, ?, ?, ?, ?, ?)`,
	selectClubByClubNameEmailSQL: `SELECT club_name FROM Club Where club_name=? AND u_email=?`,
	selectAttendInfoByIdSQL: `SELECT * FROM Attend WHERE _id=?`,
	selectAttendListByClubNameSQL: `SELECT * FROM Attend WHERE c_club_name=? ORDER BY create_on DESC`,
	selectClubMembersByClubNameSQL: `SELECT u_email FROM ClubMembers WHERE c_club_name=?`,
	userReadAttendByAttendIdSQL: `UPDATE Attend SET unread_email_list=? WHERE _id=?`,
	finePenaltyFromUserCyberMoneySQL: `UPDATE User SET cyber_money = cyber_money - ? WHERE email=?`,
	addPenaltySQL: `UPDATE Club SET penalty = penalty + ? WHERE club_name = ?`,
	addPenaltyLogSQL: `INSERT INTO PenaltyLog (c_club_name, u_email, create_on, penalty) VALUES (?,?,?,?)`,
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
			[rows,fields] = await connection.execute(this.selectClubByClubNameEmailSQL, [dataObj.clubName, dataObj.user.email]);
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
			[rows,fields] = await connection.execute(this.selectClubMembersByClubNameSQL, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 생성 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("makeNewAttend 클럽 멤버 검색 결과: %o", rows);
		let emailList = [];
		debugger;
		for(let i = 0; i < rows.length; i++) {
			emailList.push(rows[i].u_email);
		}

		let unreadEmailList = emailList.join('||');
		logger.debug("makeNewAttend 클럽 멤버 unread_email_list: %s", unreadEmailList);

		try {
			let createOn = moment(new Date()).format(config.DATE_FORMAT).toString();
			[rows,fields] = await connection.execute(this.createNewAttendSQL,
				[dataObj.clubName, dataObj.title, dataObj.deadline.toString(), createOn, dataObj.code, unreadEmailList]);
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
			[rows,fields] = await connection.execute(this.selectAttendInfoByIdSQL, [rows.insertId]);
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
			[rows,fields] = await connection.execute(this.selectAttendListByClubNameSQL, [dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 리스트 가져오기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchAttendByClubName 클럽 검색 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	},
	readAttend: async function (dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj._id)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("readAttend: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectAttendInfoByIdSQL, [dataObj._id]);
		} catch (err) {
			err.myMessage = "서버 오류. 유저 출석 읽기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("readAttend 출석 검색 결과: %o", rows);

		if(rows.length === 0) {
			let err = new Error("출석이 존재하지 않습니다."); err.myMessage="출석이 존재하지 않습니다.";
			logger.error("readAttend: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}
		if(rows[0].unread_email_list === null) {
			let err = new Error("이미 출석했습니다.");
			err.myMessage = "이미 출석했습니다."; err.code = 304;
			logger.error("readAttend: 이미 출석했습니다. rows 결과: %o", rows); throw err;
		}

		let unreadEmailList = rows[0].unread_email_list.split('||');
		if(unreadEmailList.indexOf(dataObj.user.email) < 0) {
			let err = new Error("이미 출석했습니다."); err.myMessage="이미 출석했습니다."; err.code = 304;
			logger.error("readAttend: 이미 출석했습니다. rows 결과: %o", rows);  throw err;
		}

		unreadEmailList.splice(unreadEmailList.indexOf(dataObj.user.email), 1);
		unreadEmailList = unreadEmailList.join('||');
		if(unreadEmailList.length === 0)
			unreadEmailList = null;

		try {
			[rows,fields] = await connection.execute(this.userReadAttendByAttendIdSQL, [unreadEmailList, dataObj._id]);
		} catch (err) {
			err.myMessage = "서버 오류. 유저 출석 읽기 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("readAttend 업데이트 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	},
	finePenaltytoUnread: async function(dataObj) {
		if(!(dataObj && dataObj.user instanceof Object && dataObj.user.email && dataObj._id && dataObj.clubName)) {
			let err = new Error("잘못된 입력입니다."); err.myMessage="잘못된 입력입니다.";
			logger.error("readAttend: 잘못된 입력입니다. 입력값: %o", dataObj);  throw err;
		}

		let [rows,fields] = [null, null];

		let connection = await poolCon.getConnection();
		await connection.beginTransaction();

		try {
			[rows,fields] = await connection.execute(this.selectClubByClubNameEmailSQL, [dataObj.clubName, dataObj.user.email]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 벌금 부과 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("finePenaltytoUnread 클럽 검색 결과: %o", rows);

		if(rows.length === 0) {
			let err = new Error("클럽이 없거나 권한이 없습니다.");
			await connection.rollback(); await connection.release(); throw err;
		}
		try {
			[rows,fields] = await connection.execute(this.selectAttendInfoByIdSQL, [dataObj._id]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 벌금 부과 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("finePenaltytoUnread Attend 검색 결과: %o", rows);

		if(!rows[0]) {
			let err = new Error("존재하지 않는 출석입니다.");
			await connection.rollback(); await connection.release(); throw err;
		} else if (rows[0].unread_email_list === null) {
			return [null, 304];
		}


		let userEmailList = (rows[0] && rows[0].unread_email_list) ? rows[0].unread_email_list.split("||") : [];
		let penaltyAmount = 0;

		for(let i = 0; i < userEmailList.length; i++) {
			let uEmail = userEmailList[i];
			try {
				[rows,fields] = await connection.execute(this.finePenaltyFromUserCyberMoneySQL, [1000, uEmail]);
			} catch (err) {
				err.myMessage = "서버 오류. 출석 벌금 부과 실패";
				await connection.rollback(); await connection.release(); throw err;
			}
			penaltyAmount += 1000;
			logger.debug("finePenaltytoUnread 유저 벌금부과 업데이트 결과 검색 결과: %o", rows);
			let createOn = moment(new Date()).format(config.DATE_FORMAT).toString();

			try {
				[rows,fields] = await connection.execute(this.addPenaltyLogSQL, [dataObj.clubName, uEmail,
					createOn, 1000]);
			} catch (err) {
				err.myMessage = "서버 오류. 출석 벌금 로그 남기기 실패";
				await connection.rollback(); await connection.release(); throw err;
			}
			logger.debug("finePenaltytoUnread 유저 벌금부과 로그 추가 결과: %o", rows);
		}

		try {
			[rows,fields] = await connection.execute(this.addPenaltySQL, [penaltyAmount, dataObj.clubName]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 벌금 부과 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchAttendByClubName 클럽 벌금 추가 결과: %o", rows);

		try {
			[rows,fields] = await connection.execute(this.userReadAttendByAttendIdSQL, [null, dataObj._id]);
		} catch (err) {
			err.myMessage = "서버 오류. 출석 벌금 부과 실패";
			await connection.rollback(); await connection.release(); throw err;
		}
		logger.debug("searchAttendByClubName 읽지않은 유저 목록 삭제 결과: %o", rows);

		await connection.commit();
		await connection.release();

		return [rows, fields];
	}
};