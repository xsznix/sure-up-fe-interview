'use strict';

(function (undefined) {

	var vehicleTemplate = _.template($('#tmp_vehicle').html());
	var vehicleEditTemplate = _.template($('#tmp_edit_vehicle').html());
	var errorTemplate = _.template($('#tmp_errors').html());

	window.VehicleView = Backbone.View.extend({
		tagName: 'tr',
		attributes: function () {
			return {
				'data-id': this.model.get('id')
			}
		},

		initialize: function (options) {
			this.editing = options ? options.editing : false;
			this.checkEditStateBound = this.checkEditState.bind(this);
			this.cancelChangesBound = this.cancelChanges.bind(this);

			if (this.editing)
				E.fire('edit.init', this);

			E.addCallback('edit.init', this.checkEditStateBound);
			E.addCallback('edit.escape', this.cancelChangesBound);
		},
		render: function () {
			var model = this.model.toJSON();

			if (this.editing)
				this.$el.html(vehicleEditTemplate(model));
			else
				this.$el.html(vehicleTemplate(model));

			return this;
		},
		events: {
			'click .saveButton': 'commitChanges',
			'click .cancelButton': 'cancelChanges',
			'click .deleteButton': 'removeSelf',
			'click td:not(:last-child)': 'startEdit',
			'click .closeErrorButton': 'closeError',
			'keydown': 'handleKey'
		},
		destroyView: function () {
			E.removeCallback('edit.init', this.checkEditStateBound);
			E.removeCallback('edit.escape', this.cancelChangesBound);
		},

		// onError: an optional callback for when the server returns an error.
		// preserveError: (bool) if true, will not hide the currently shown
		// error.
		// These are used in VehicleView.checkEditState, when deactivating edit
		// mode on a row implicitly by selecting another row.
		commitChanges: function (onError, preserveError) {
			if (!this.editing) return;

			if (!preserveError)
				E.fire('error.hide');

			var find = this.$el.find;

			var newVals = {
				nickname: this.$el.find('.nickname').val(),
				year: this.$el.find('.year').val(),
				make: this.$el.find('.make').val(),
				model: this.$el.find('.model').val()
			}

			// return early so `model.commit()` doesn't run if there are no
			// changes
			if (this.model.id
			 && newVals.nickname === this.model.get('nickname')
			 && newVals.year === this.model.get('year')
			 && newVals.make === this.model.get('make')
			 && newVals.model === this.model.get('model')) {
			 	this.editing = false;
			 	this.render();
				return;
			}

			this.model.set(newVals);

			this.model.commit().then(function () {
				this.editing = false;
				this.render();
			}.bind(this), function (data) {
				E.fire('error.show', data.errors);
				this.render();
				this.$el.find('input').eq(0).focus();

				if (typeof onError === 'function')
					onError();
			}.bind(this));
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
				this.model.destroy().then(undefined, logerr);
			E.fire('table.remove', this.model);
		},
		startEdit: function (ev) {
			if (this.editing) return;
			this.editing = true;
			// Focus input after re-rendering
			var idx = $(ev.currentTarget).index();
			this.render();
			E.fire('edit.init', this); // Close other rows in edit mode
			this.$el.children().eq(idx).find('input').focus();
		},
		checkEditState: function (model) {
			if (this !== model && this.editing) {
				// If we clicked out of edit mode, try to commit the changes,
				// but go back into edit mode if there are any errors, closing
				// the editing form the user just opened.
				var _this = this;
				this.commitChanges(function () {
					E.fire('edit.init', _this);
				}, true);
			}
		},
		handleKey: function (e) {
			// Enter commits changes. ESC can't be captured here, for some
			// odd reason.
			if (e.keyCode === 13) {
				this.commitChanges();
			}
		}
	});

	window.VehicleTableView = Backbone.View.extend({
		tagName: 'table',
		template: _.template($('#tmp_vehicle_table').html()),
		el: '#vehicleTable',

		initialize: function (options) {
			E.addCallback('table.remove', this.remove.bind(this));
			E.addCallback('error.show', this.showError.bind(this));
			E.addCallback('error.hide', this.hideError.bind(this));

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
			'click #newVehicle': 'createNew',
			'click #hideError': 'hideError'
		},

		// vehicle: VehicleModel, editing: boolean
		add: function (vehicle, editing) {
			var view = new VehicleView({ model: vehicle, editing: !!editing });
			this.vehicles.push(view);
			this.$vehicles.append(view.render().el);
			$(view.el).find('input').eq(0).focus();

			this.hideError();
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

			viewToRemove.destroyView();

			$(viewToRemove.el).remove();

			this.hideError();
		},
		createNew: function () {
			this.add(new VehicleModel({}), true);
		},
		showError: function (errors) {
			this.$el.find('#errors').html(errorTemplate({ errors: errors }));
		},
		hideError: function () {
			this.$el.find('#errors').html('');
		}
	})

})();
