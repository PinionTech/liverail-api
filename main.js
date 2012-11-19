var request = require('request')
	, crypto = require('crypto')
	, qs = require('querystring')
	, xml2js = require('xml2js')
	, endPoint = 'http://api4.int.liverail.com'
	, liverail = exports
	, token = undefined
	;

function setEndPoint(env) {
	if ( env === 'production' ) {
		endPoint = 'http://api4.liverail.com'
	} else {
		endPoint = 'http://api4.int.liverail.com'
	}
}

liverail.setEndPoint = setEndPoint;

liverail.login = function (user, pass, callback) {
	var parser = new xml2js.Parser();
	var passHash = crypto.createHash('md5').update(pass).digest('hex');
	request({
		method: 'POST',
		uri: endPoint + '/login',
		headers: {"content-type": "application/x-www-form-urlencoded"},
		body: qs.encode({
			username: user,
			password: passHash
		})
	}, function (error, response, body) {
		parser.parseString(body, function (err, result) {
			token = result.auth.token;
			if (typeof callback !== "undefined") {
				if (result.status !== 'success') return callback(result['_ERRORS_'], result)
				return callback(false, result);
			}
		});
	})
};

liverail.call = function () {
	var parser = new xml2js.Parser();
	var argArray = [];
	for ( var i = 0 ; i < arguments.length ; i++ ) {
		argArray.push(arguments[i]);
	}
	if ( typeof argArray[argArray.length - 1] === 'function' ) var callback = argArray.pop();
	if ( token === undefined ) {
		if ( typeof callback === 'function' ) return callback('Login token not set')
		return null
	}
	var route = argArray.shift();
	if ( typeof argArray[0] !== 'undefined' ) var input = argArray[0];
	if ( typeof input === 'undefined' )	input = {};
	input.token = token;
	request({
		method: 'POST',
		uri: endPoint + route,
		headers: {"content-type": "application/x-www-form-urlencoded"},
		body: qs.encode(input)
	}, function(error, response, body) {
		if ( typeof callback !== 'undefined') {
			if(error) {
				return callback(error)
			}
			parser.parseString(body, function (error, result) {
				if(error) return callback(error)
				return callback(false, result, body, response)
			});
		}
	});
};

setEndPoint(process.env.NODE_ENV);
