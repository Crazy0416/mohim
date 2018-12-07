'use strict';
const config = require('../../config/config');
const mysql = require('mysql2/promise');
const to = require('await-to-js').default;

const pool = mysql.createPool({
	connectionLimit : config.mysql.CONNECTION_POOL,
	host     : config.mysql.HOST,
	user     : config.mysql.USER,
	password : config.mysql.PASSWORD,
	database: config.mysql.DATABASE,
	port: config.mysql.PORT
});
const connection = pool;

pool.on('acquire', function (connection) {
	//logger.debug('mysql Connection %d acquired', connection.threadId);
});

pool.on('connection', async function (connection) {
	logger.debug('connection mysql');
});

async function createTable(dbName, tableName, tableSchemaSql) {
	let database_ = dbName;
	let table_ = tableName;
	const checkTableSql = `SELECT COUNT(*) 
	FROM information_schema.TABLES 
	WHERE (TABLE_SCHEMA = '${database_}') AND (TABLE_NAME = '${table_}')`;
	let [err, [rows, fields]] = await to(connection.query(checkTableSql));
	if(err) {
		logger.error('Mysql connection error!!! %o', err);
		throw err;
	}
	logger.debug("check table rows: %o", rows[0]['COUNT(*)']);

	if(rows[0]['COUNT(*)'] === 0) {
		[err, rows] = await to(connection.query(tableSchemaSql));
		if(err) {
			logger.error('Mysql connection error!!! %o', err);
			throw err;
		}
		logger.debug("Mysql Create User table success %o", rows);
	}
	return true;
}

async function init() {
	const createUesrTableSql = `CREATE TABLE User (
		email VARCHAR(30) NOT NULL,
		uname VARCHAR(10) NOT NULL,
		pwd VARCHAR(16) NOT NULL,
		cyber_money INT(11) NOT NULL default '0',
		PRIMARY KEY (email)
	);`;
	let result = await createTable(config.mysql.DATABASE, "User", createUesrTableSql);
	if(result !== true) throw result;

	const createClubTableSql = `CREATE TABLE Club (
		club_name VARCHAR(30) NOT NULL,
		club_info VARCHAR(100),
		u_email VARCHAR(30) NOT NULL,
		user_count INT(11) unsigned NOT NULL default '0',
		penalty INT(11) NOT NULL default '0',
		PRIMARY KEY (club_name),
		FOREIGN KEY (u_email) REFERENCES User (email)
	);`;

	result = await createTable(config.mysql.DATABASE, "Club", createClubTableSql);
	if(result !== true) throw result;

	const createAttendTableSql = `CREATE TABLE Attend (
		_id BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
		c_club_name VARCHAR(30) NOT NULL,
		title VARCHAR(30) NOT NULL, 
		deadline DATE NOT NULL,
		code VARCHAR(20) NOT NULL,
		PRIMARY KEY (_id),
		FOREIGN KEY (c_club_name) REFERENCES Club (club_name)
	);`;

	result = await createTable(config.mysql.DATABASE, "Attend", createAttendTableSql);
	if(result !== true) throw result;

	const createNoticeTableSql = `CREATE TABLE Notice (
		_id BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
		c_club_name VARCHAR(30) NOT NULL,
		title VARCHAR(30) NOT NULL, 
		content VARCHAR(100),
		PRIMARY KEY (_id),
		FOREIGN KEY (c_club_name) REFERENCES Club (club_name)
	);`;

	result = await createTable(config.mysql.DATABASE, "Notice", createNoticeTableSql);
	if(result !== true) throw result;

	const createClubMembersTableSql = `CREATE TABLE ClubMembers (
		c_club_name VARCHAR(30) NOT NULL,
		u_email VARCHAR(30) NOT NULL,
		PRIMARY KEY (c_club_name, u_email),
		FOREIGN KEY (c_club_name) REFERENCES Club (club_name),
		FOREIGN KEY (u_email) REFERENCES User (email)
	);`;

	result = await createTable(config.mysql.DATABASE, "ClubMembers", createClubMembersTableSql);
	if(result !== true) throw result;
}
init();
module.exports = pool;