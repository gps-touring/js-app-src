define( ["util/xml", "model/userdata"], function(xml, userdata) {
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
			// milestone: property created if setMilestone is called.
		});
		if (opts.gpxWpt !== undefined) {
			// We don't want to waste space with this property if it isn't needed.
			Object.defineProperty(this, "gpxWpt", { value: opts.gpxWpt, enumerable: true });
		}
		//console.log(this);
	}
	Point.prototype.getName = function() {
		if (this.milestone) {
			return this.milestone;
		}
		return this.gpxWpt && this.gpxWpt.name ? this.gpxWpt.name : "";
	};
	Point.prototype.getDesc = function() {
		return this.milestone ? this.milestone : "";
	};
	Point.prototype.getCmt = function() {
		return this.milestone ? "cmt" : "";
	};
	Point.prototype.getSym = function() {
		return this.milestone ? "10" : "";
	};
	Point.prototype.dump = function() {
		return "lat: " + this.lat + ", lng: " + this.lng + ", ele: " + this.ele;
	};
	function metresToKmString(m) {
		return (m/1000).toFixed(2).toString() + "km";
	}
	Point.prototype.setMilestone = function(m) {	// m is in metres.
		//console.log("Point.setMilestone: " + m);
		this.milestone = metresToKmString(m);
	};
	Point.prototype.isJustLocation = function() {
		if (this.gpxWpt) {
			return (Object.keys(this.gpxWpt).filter(function(k) {
				return k != "lat" && k != "lon" && k != "ele";
			}).length === 0);
		}
		// Testing this.milestone depends on the fact that it is a string, not a Number (e.g. the number 0 - false):
		if (this.milestone) {
			return false;
		}
		return true;
	};
	Point.prototype.milestoneHoverText = function() {
		// Testing this.milestone depends on the fact that it is a string, not a Number (e.g. the number 0 - false):
		if (this.milestone) {
			return "milestone: " + this.milestone + "\n"; 
		}
		else {
			return "";
		}
	};
	Point.prototype.toHoverText = function() {
		if (this.gpxWpt) {
			return Object.keys(this.gpxWpt).map(function(k) {
				return k + ": \"" + this.gpxWpt[k] + "\"";
			}, this).join("\n");
		}
		else {
			return this.milestoneHoverText() + ["lat", "lng", "ele"].map(function(k) {
				return k + ": \"" + this[k] + "\"";
			}, this).join("\n");
		}
	};
	var xmlEle = function(tag, ele) {
		return ele.length > 0 ? xml.xml(tag, {}, ele.encodeHTML()) : "";
	};
	Point.prototype.rteptXml = function(cummDist) {
		var name = this.getName();
		// If we put a name in for each point, then we get an icon displayed by ViewRanger for each point
		// and this is messy when displayed on the phone.
		// Therefore commenting out this:
		//if (name.length === 0) name = metresToKmString(cummDist);
		return xmlEle("name", name) +
			xmlEle("sym", this.getSym()) +
			//xmlEle("cmt", this.getCmt()) +
			// Somewhat irrationally, the Description of a waypoing in my.vireranger.com gets populated via the <cmt>
			// element of the gpt <rtept>. Whoda thought it?
			xmlEle("cmt", this.getDesc()) +
			""
			;
	};
	Point.prototype.toGpx = function() {
		// TODO - check if this.gpxWpt is not null, and add more fields into the GPX, not just name
		//        This is a temp hack to dump out campsites from archies GPX files.
		// TODO - redo this using features of util/xml.
		return "<wpt lat=\"" + this.lat + "\" lon=\'" + this.lng + "\">" + 
			"<name>" + this.gpxWpt.name.encodeHTML() + "</name>" +
			"</wpt>";
	};
	Point.prototype.isSameLatLng = function(pt) {
		return this.lat === pt.lat && this.lng == pt.lng;
	};

	Point.prototype.gpxAttrs = function() {
		// 5 decimal places gives accuracy to about 1 metre.
		return {lat: Number(this.lat).toFixed(5), lon: Number(this.lng).toFixed(5)};
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

