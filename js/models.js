'use strict';

(function (undefined) {

	window.VehicleModel = Backbone.Model.extend({
		defaults: {
			nickname: '',
			year: '',
			make: '',
			model: ''
		},

		commit: function () {
			var _this = this;

			return new Promise(function (resolve, reject) {
				if (_this.id) {
					API.update(_this).then(function (data) {
						_this.set(data);
						resolve(data);
					}, reject);
				} else {
					API.create(_this).then(function (data) {
						_this.set(data);
						resolve(data);
					}, reject)
				}	
			})
		},

		destroy: function () {
			return API.destroy(this.id);
		}
	});

})();
