define( ["model/userdata", "app/eventbus"], function(userdata, eventbus) {
	"use strict";

	var store = {
	};
	var Point = function(lat, lng) {
		this.lat = lat;
		this.lng = lng;
	};
	function setStart(lat, lng) {
		if (store.start) {
			eventbus.publish({topic: "Point.remove", data: {point: store.start}});
		}
		store.start = new Point(lat, lng);
		eventbus.publish({topic: "Point.addStart", data: {point: store.start}});
	}
	function setFinish(lat, lng) {
		if (store.finish) {
			eventbus.publish({topic: "Point.remove", data: {point: store.finish}});
		}
		store.finish = new Point(lat, lng);
		eventbus.publish({topic: "Point.addFinish", data: {point: store.finish}});
	}
	Point.prototype.setUserData = userdata.setUserData;
	Point.prototype.getUserData = userdata.getUserData;

	var pub = {
		setStart: setStart,
		setFinish: setFinish
	};
	return pub;
});

