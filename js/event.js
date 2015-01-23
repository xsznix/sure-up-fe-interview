'use strict';

// A simple global event dispatcher.

var E = (function (E, undefined) {
	
	var events = new Map();

	E.addCallback = function (eventName, callback) {
		if (!events.has(eventName))
			events.set(eventName, new Set().add(callback));
		else
			events.get(eventName).add(callback);
	}

	E.removeCallback = function (eventName, callback) {
		var evt = events.get(eventName);
		if (evt !== undefined) {
			evt.delete(callback);
			if (evt.length === 0)
				events.delete(eventName);
		}
	}

	E.fire = function (eventName) {
		var callbacks = events.get(eventName);
		if (callbacks === undefined) {
			console.warn('No callbacks for event: ' + eventName);
			return;
		}
		
		var args = Array.prototype.slice.call(arguments, 1);
		callbacks.forEach(function (c) {
			c.apply(this, args);
		}, this);
	}

	return E;

})(E || {});
