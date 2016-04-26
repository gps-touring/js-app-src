define( ["model/userdata"], function(userdata) {
	"use strict";

	// Point is a location on the Earth in latitude and longitude, and includes (optionally) an elevation.
	// Other optional properties:
	//
	// 	userdata		To enable the client code to stor information with the Point (e.g. References to objects in the View).
	// 	gpxWpt			The fill GPX Waypoint data (only defined if this Point originated from GPX).
	//
	function Point(lat, lng, ele, opts) {
		opts = opts || {};
		Object.defineProperties(this, {
			lat: { value: lat, enumerable: true },
			lng: { value: lng, enumerable: true },
			ele: { value: ele, enumerable: true },
		});
		if (opts.gpxWpt !== undefined) {
			// We don't want to waste space with this property if it isn't needed.
			Object.defineProperty(this, "gpxWpt", { value: opts.gpxWpt, enumerable: true });
		}
		//console.log(this);
	}
	Point.prototype.dump = function() {
		return "lat: " + this.lat + ", lng: " + this.lng + ", ele: " + this.ele;
	};
	// We don't define userdata as a property of Point, because we want it to be created on demand,
	// so it does not take up unnecessary space in this highly numerous object.
	Point.prototype.setUserData = userdata.setUserData;
	Point.prototype.getUserData = userdata.getUserData;

	var pub = {
		Point: Point
	};
	return pub;
});

