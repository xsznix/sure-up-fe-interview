'use strict';

(function (undefined) {

	var vehicleTemplate = _.template($('#tmp_vehicle').html());
	var vehicleEditTemplate = _.template($('#tmp_edit_vehicle').html());

	window.VehicleView = Backbone.View.extend({
		tagName: 'tr',
		attributes: function () {
			return {
				'data-id': this.model.get('id')
			}
		},

		initialize: function (options) {
			this.editing = options ? options.editing : false;
		},
		render: function () {
			if (this.editing)
				this.$el.html(vehicleEditTemplate(this.model.toJSON()));
			else
				this.$el.html(vehicleTemplate(this.model.toJSON()));
			return this;
		},
		events: {
			'click .saveButton': 'commitChanges',
			'click .cancelButton': 'cancelChanges',
			'click .deleteButton': 'removeSelf',
			'click .editButton': 'startEdit'
		},

		commitChanges: function () {
			if (!this.editing) return;
			this.editing = false;

			var find = this.$el.find;

			this.model.set({
				nickname: this.$el.find('.nickname').val(),
				year: this.$el.find('.year').val(),
				make: this.$el.find('.make').val(),
				model: this.$el.find('.model').val()
			});
			this.render();
			this.model.commit();
		},
		cancelChanges: function () {
			if (!this.editing) return;

			if (this.model.isNew())
				this.removeSelf();
			else {
				this.editing = false;
				this.render();
			}
		},
		removeSelf: function () {
			if (!this.model.isNew())
				this.model.destroy();
			E.fire('table.remove', this.model);
		},
		startEdit: function () {
			this.editing = true;
			this.render();
		}
	});

	window.VehicleTableView = Backbone.View.extend({
		tagName: 'table',
		template: _.template($('#tmp_vehicle_table').html()),
		el: '#content',

		initialize: function (options) {
			E.addCallback('table.remove', this.remove.bind(this));

			this.vehicles = options.vehicles.map(function (v) {
				return new VehicleView({ model: new VehicleModel(v) });
			});
			this.render();
		},
		render: function () {
			this.$el.html(this.template({}));
			this.$vehicles = this.$el.find('#vehicles');
			this.$vehicles.empty();
			this.vehicles.forEach(function (v) {
				this.$vehicles.append(v.render().el);
			}, this);

			return this;
		},
		events: {
			'click #newVehicle': function (ev) {
				this.createNew();
			}
		},

		// vehicle: VehicleModel, editing: boolean
		add: function (vehicle, editing) {
			var view = new VehicleView({ model: vehicle, editing: !!editing });
			this.vehicles.push(view);
			this.$vehicles.append(view.render().el);
		},
		// vehicle: VehicleModel
		remove: function (vehicle) {
			var viewToRemove;

			this.vehicles = this.vehicles.filter(function (v) {
				if (v.model === vehicle) {
					viewToRemove = v;
					return false;
				} else return true;
			});

			$(viewToRemove.el).remove();
		},
		createNew: function () {
			this.add(new VehicleModel({}), true);
		}
	})

})();
