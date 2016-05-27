define( ["model/userdata"], function(userdata) {
	"use strict";

	// TODO: move this somewhere better!
	if (!String.prototype.encodeHTML) {
		String.prototype.encodeHTML = function () {
			return this.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&apos;');
		};
	}
	

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
			ele: { value: ele, enumerable: true }
			// userdata: property created if setUserData is called.
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
	Point.prototype.toGpx = function() {
		// TODO - check if this.gpxWpt is not null, and add more fields into the GPX, not just name
		//        This is a temp hack to dump out campsites from archies GPX files.
		return "<wpt lat=\"" + this.lat + "\" lon=\'" + this.lng + "\">" + 
			"<name>" + this.gpxWpt.name.encodeHTML() + "</name>" +
			"</wpt>";
	};
	// We don't define userdata as a property of Point, because we want it to be created on demand,
	// so it does not take up unnecessary space in this highly numerous object.
	Point.prototype.setUserData = userdata.setUserData;
	Point.prototype.getUserData = userdata.getUserData;

	var TORADIANS = Math.PI / 180;
	Point.prototype.distanceTo = function(p) {
		// Uses Haversine - more accurate over short distances.
		var R = 6371000; // metres
		var thisLatRad = this.lat * TORADIANS;
		var pLatRad = p.lat * TORADIANS;
		var latDiffRad = (p.lat - this.lat) * TORADIANS;
		var lngDiffRad = (p.lng - this.lng) * TORADIANS;

		var a = Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
			Math.cos(thisLatRad) * Math.cos(pLatRad) *
			Math.sin(lngDiffRad / 2) * Math.sin(lngDiffRad / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		//console.log("Point.distanceTo: " + R * c + " metres");
		return R * c;
	};

	var pub = {
		Point: Point
	};
	return pub;
});

