define( ["app/eventbus"], function(eventbus) {
	"use strict";

	var store = {
		start: undefined
	};
	var Point = function(lat, lng) {
		this.lat = lat;
		this.lng = lng;
	};
	function setStart(lat, lng) {
		if (store.start) {
			eventbus.publish({topic: "Point.removeStart", data: {point: store.start}});
		}
		store.start = new Point(lat, lng);
		eventbus.publish({topic: "Point.addStart", data: {point: store.start}});
	}

	var pub = {
		setStart: setStart
	};
	return pub;
});

