'use strict';

// Partial polyfills for Map and Set for old browsers

if (typeof Map === 'undefined') {
	window.Map = function () {
		this.map = {};
		this.size = 0;
	}

	Map.prototype.has = function (key) {
		return typeof this.map[key] !== 'undefined';
	}

	Map.prototype.get = function (key) {
		return this.map[key];
	}

	Map.prototype.set = function (key, value) {
		if (typeof this.map[key] === 'undefined')
			this.size++;

		this.map[key] = value;
		return this;
	}

	Map.prototype.delete = function (key) {
		if (this.has(key)) {
			delete this.map[key];
			this.size--;
			return true;
		} else return false;
	}
}

if (typeof Set === 'undefined') {
	// Fall back to a simple array
	window.Set = function () {
		this.set = [];
		this.length = 0;
	}

	Set.prototype.has = function (value) {
		return this.set.indexOf(value) !== -1;
	}

	Set.prototype.add = function (value) {
		if (this.has(value))
			return this;

		this.set.push(value);
		this.length++;
		return this;
	}

	Set.prototype.delete = function (value) {
		var index = this.set.indexOf(value);
		if (index !== -1) {
			this.set.splice(index);
			this.length--;
			return true;
		} else return false;
	}

	Set.prototype.forEach = function (fn, thisArg) {
		this.set.forEach(fn, thisArg);
	}
}
