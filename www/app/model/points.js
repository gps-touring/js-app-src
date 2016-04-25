define( ["model/point", "app/eventbus"], function(point, eventbus) {
	"use strict";

	var store = {
	};
	function setStart(lat, lng) {
		if (store.start) {
			eventbus.publish({topic: "Point.remove", data: {point: store.start}});
		}
		store.start = new point.Point(lat, lng);
		eventbus.publish({topic: "Point.addStart", data: {point: store.start}});
	}
	function setFinish(lat, lng) {
		if (store.finish) {
			eventbus.publish({topic: "Point.remove", data: {point: store.finish}});
		}
		store.finish = new point.Point(lat, lng);
		eventbus.publish({topic: "Point.addFinish", data: {point: store.finish}});
	}

	var pub = {
		setStart: setStart,
		setFinish: setFinish
	};
	return pub;
});

