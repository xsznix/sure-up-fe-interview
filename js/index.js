'use strict';

// Debugging
function logerr (data) {
	console.error(data.errors.join('\n'));
}

var E = _.extend({}, Backbone.Events);

$(function () {

	// Populate vehicles table
	API.list().then(function (data) {
		new VehicleTableView({
			vehicles: data
		})
	}, function (data) {
		E.trigger('error:show', data.errors);
	})

	// Fire `edit.escape` to cancel all changes when ESC is pressed.
	$(document).keydown(function (e) {
		if (e.keyCode === 27) {
			E.trigger('edit:escape');
			return false;
		}
	})

})