import constants from '../config/constants';
import util from '../util/util';
var btoa = require('base-64').encode;

var api = {
	post(user, pw, url, params, cb) {
		if (user) {
			let full_url = constants.flow_base + url;
			console.log(`POST to ${full_url}`);
			let encoded = btoa(`${user.email}:${pw}`);
			let headers = new Headers({
			  "Authorization": `Basic ${encoded}`,
			  'Content-Type': 'application/x-www-form-urlencoded',
			});
			let body = util.serializeJSON(params);
			fetch(full_url, {
		      method: "POST",
		      headers: headers,
		      body: body
		    }).then(function(response) {
				if (response.status !== 200) {
			        console.log('Looks like there was a problem. Status Code: ' +
			          response.status);
			        return;
			    }
			    // Examine the text in the response
			    response.json().then(function(data) {
			        if (cb) cb(data);
			    });

		    });
		} else console.error("No user");
	}
}

export default api;