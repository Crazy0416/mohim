'use strict';

// required environment variables
	[
		'NODE_ENV'
	].forEach((name) => {
		if (!process.env[name]) {
			throw new Error(`Environment variable ${name} is missing`)
		}
	});
const config = {};

if(process.env.NODE_ENV === "dev") {
	config.mysql = {
		"CONNECTION_POOL": 10,
		"DATABASE": 'mohim',
		"USER": 'root',
		"PASSWORD": 'KIMho0715!@',
		"HOST": 'localhost',
		"PORT": 3306
	};
	config.server = {
		PORT: 3000
	};
	config.logLevel = 'debug'
} else if(process.env.NODE_ENV === "prod") {
	config.mysql = {
		"CONNECTION_POOL": 10,
		"DATABASE": 'mohim',
		"USER": 'root',
		"PASSWORD": 'KIMho0715!@',
		"HOST": 'localhost',
		"PORT": 3306
	};
	config.server = {
		PORT: 5900
	};
	config.logLevel = 'info'
}

module.exports = config;