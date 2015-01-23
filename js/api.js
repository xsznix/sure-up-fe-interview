'use strict';

var API = (function (API, undefined) {

	// API endpoint constants

	var APIROOT = 'https://sureup-fe-interview.herokuapp.com';
	var APIURL = {
		LIST: withKey(APIROOT + '/vehicles.json'),
		CREATE: withKey(APIROOT + '/vehicles.json'),
		UPDATE: function (id) {
			return withKey(APIROOT + '/vehicles/' + id + '.json');
		},
		DESTROY: function (id) {
			return withKey(APIROOT + '/vehicles/' + id + '.json');
		}
	}
	Object.freeze(APIURL);
	var HTTP_ERR_STR = 'An error occurred while trying to reach the server.';

	// Helper functions

	function withKey (url) {
		return url + '?api_key=' + APIKEY; // APIKEY is defined in apikey.js
	}

	function httpErr (reject) {
		return function () {
			reject({ errors: [HTTP_ERR_STR] });
		}
	}

	// Input: VehicleModel
	function makeVehicleParams (vehicle) {
		return {
			vehicles: {
				nickname: vehicle.get('nickname'),
				year: vehicle.get('year'),
				make: vehicle.get('make'),
				model: vehicle.get('model')
			}
		}
	}

	// API endpoints for frontend

	// For all APIs, `resolve` will take a JSON object as described in the API
	// documentation (see README.md); `reject` will take a JSON object of the
	// following form, whether thrown by the API or by HTTP (timeout, etc.):
	//
	//   {
	//	   errors: Array<string>
	//   }

	API.list = function () {
		return new Promise(function (resolve, reject) {
			$.ajax(APIURL.LIST, {
				type: 'GET',
				error: httpErr(reject),
				success: function (data) {
					resolve(data);	
				}
			})
		})
	}

	API.create = function (vehicle) {
		return new Promise(function (resolve, reject) {
			$.ajax(APIURL.CREATE, {
				type: 'POST',
				data: makeVehicleParams(vehicle),
				error: httpErr(reject),
				statusCode: {
					406: function (data) {
						reject(data);
					}
				},
				success: function (data) {
					resolve(data);
				}
			})
		})
	}

	API.update = function (vehicle) {
		return new Promise(function (resolve, reject) {
			$.ajax(APIURL.UPDATE(id), {
				type: 'PUT',
				data: makeVehicleParams(vehicle),
				error: httpErr(reject),
				statusCode: {
					406: function (data) {
						reject(data);
					}
				},
				success: function (data) {
					resolve(data);
				}
			})
		})
	}

	API.destroy = function (id) {
		return new Promise(function (resolve, reject) {
			$.ajax(APIURL.DESTROY(id), {
				type: 'DELETE',
				error: httpErr(reject),
				success: function (data) {
					resolve(data);
				}
			})
		})
	}

	return API;

})(API || {});