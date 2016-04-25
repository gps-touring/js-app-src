define( [], function() {
	"use strict";

	function Point(lat, lng, ele, opts) {
		opts = opts || {};
		Object.defineProperties(this, {
			lat: { value: lat, enumerable: true },
			lng: { value: lng, enumerable: true },
			ele: { value: ele, enumerable: true },
			gpxWpt: { value: opts.gpxWpt, enumerable: true },
			userdata: { value: {}, writable: true }
		});
		console.log(this);
		// TODO - Decide if gpxWpt should be defined for all points that originate from GPX, or just those which have
		//        data in addition to the lat, lng and ele. I think the latter is prefereable.
	}
	Point.prototype.dump = function() {
		return "lat: " + this.lat + ", lng: " + this.lng + ", ele: " + this.ele;
	};
	/*
	var p = new Point(51.223, -1.005, 234);
	console.log(p);
	console.log(p.dump());
	p.userdata = {foo: 1};
	console.log(p.userdata);
   */

	var pub = {
		Point: Point
	};
	return pub;
});

