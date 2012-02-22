# liverail-api 

## Purpose

This provides a node client library to use the Liverail API. 

[Liverail]: http://liverail.com/ 

Created by Pinion.

[Pinion]: http://pinion.gg/

## Installation

npm install liverail-api

## Demo

```javascript
var liverail = require('liverail-api');

liverail.login('username', 'password', function() {
	liverail.call('/entity/list', function(err, result) {
		if (err) { 
			console.error("Oh no!")
		} else {
			console.log(result.entities)
		}
	});
});
```

```javascript
var liverail = require('liverail-api');

liverail.login('username', 'password', function() {
	var params = {
		order_line_id: '123',
		time_end: '2012-02-22 00:00:00'
	}
	liverail.call('/order/line/edit', params, function(err, result) {
		if (err) { 
			console.error("Oh no!")
		}
	});
});
```

## API

### liverail.login(username, password, [callback])
login takes 3 arguments; username, password and a callback, to which it will pass an error indicator and the results from Liverail in case you're interested in them.

### liverail.call(route, [params], [callback])
call is a generic call function that will call a specified route on the liverail API. The token is added automatically, but you may pass an object with additional parameters to send to the api. You may also pass a callback, which will be called with an error indicator and the results of the API call.
