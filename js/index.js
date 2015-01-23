'use strict';

$(function () {

	// Debugging
	function logerr (data) {
		console.err(data.errors.join('\n'));
	}

	// Populate vehicles table
	API.list().then(function (data) {
		new VehicleTableView({
			vehicles: data
		})
	}, logerr)

})