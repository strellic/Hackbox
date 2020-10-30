import isofetch from 'isomorphic-fetch';
import cookie from 'cookie-cutter';

export default function fetch(url, options = {}) {
	if(!options.headers) {
		options.headers = {};
	}

	if(typeof window !== 'undefined' && (!options.headers.Authorization && !options.noToken)) {
		if(cookie.get("authToken"))
			options.headers.Authorization = cookie.get("authToken");
	}

	return isofetch(url, options);
}