'use strict';

process.env.DATABASE_NAME = process.env.DATABASE_NAME || 'austackdb';

module.exports = {

	ip: process.env.ip || undefined,

	port: process.env.PORT || 8080,

	publicDir: 'public',

	mongo: {
		uri: 'mongodb://peter:Be8s2fsisOdWy@115.28.162.221:27088/' + process.env.DATABASE_NAME
	}
};
