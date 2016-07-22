define( ["util/xml", "model/gpx", "model/lineSeg", "model/userdata", "model/mouseStates", "app/eventbus"], function(xml, gpx, lineSeg, userdata, mouseStates, eventbus) {
	"use strict";

	var eventPrefix = "PointSeq";

	var modelObjects = [];
	// Waypoint sequences represent routes (or tracks).
	// A Sequence of waypoints is a core part of the model: it is what defines a section of a route.

	var PointSeq = function(theSource, theSeq) {
		var cache = {
			distance: null
		};
		Object.defineProperties(this, {
			// TODO - remove the source property.
			// TODO - remove the gpxRte and gpxTrk properties too.
			source: { value: theSource, enumerable: true },
			points: {value: theSeq.points, enumerable: true },
			id: {value: modelObjects.length, enumerable: true },
			gpxRte: { value: theSeq.gpxRte, enumerable: true },
			gpxTrk: { value: theSeq.gpxTrk, enumerable: true },
			length: { value: theSeq.points.length, enumerable: true },
			distance: {
				get: function() {
					if (cache.distance === null) {
						cache.distance = this.getDistance();
					}
					return cache.distance;
				}
			}
			// userdata: property created if setUserData is called.
		});
		// mouseStates defines some properties (currently, 1 property, "selected") for our modelObject:
		Object.defineProperties(this, mouseStates.objectProperties);
		//console.log(this);
		modelObjects.push(this);
		eventbus.publish({topic: eventPrefix + ".new", data: {modelObject: this}});
	};
	// define a userdata property for PointSeq if setUserData is called:
	PointSeq.prototype.setUserData = userdata.setUserData;
	PointSeq.prototype.getUserData = userdata.getUserData;

	// mouseStates will create functions for this module, which are configured
	// by parameters for use by this module:
	PointSeq.prototype.setSelected = mouseStates.setSelected(eventPrefix, modelObjects);
	PointSeq.prototype.clearSelections = mouseStates.clearSelections(modelObjects);
	PointSeq.prototype.setHovered = mouseStates.setHovered(eventPrefix);

	PointSeq.prototype.getSourceName = function() {
		return this.source.name;
	};
	PointSeq.prototype.getDistance = function() {
		var pts = this.points;
		var i, len = pts.length;
		var res = 0;
		for (i = 1; i < len; ++i) {
			res += pts[i - 1].distanceTo(pts[i]);
		}
		//console.log("PointSeq.getDistance, " + len + " points, " + res + " metres");
		return res;
	};
	PointSeq.prototype.toGpx = function() {
		return xml.xml("gpx",
					   {
						   xmlns: "http://www.topografix.com/GPX/1/1",
						   version: "1.1",
						   creator: "https://github.com/gps-touring/js-app-src"
					   },
					   xml.xml("rte", {}, 
							   this.points.map(function(p) { return xml.xml("rtept", p.gpxAttrs(), "") }).join(""))
					  );
	};
	PointSeq.prototype.simplify = function() {
		// remove points that contribute little to the path
		var allowedError = 5;	// metres
		var originalPts = this.points;
		var pts = [];	// New sequence of points
		var i = 0;
		var n = this.length;
		var intermedatePointsTooFarAway = function(a, b) {
			console.assert( a >= 0, "pointseq.nextPointToKeep - bad parameter a negative");
			console.assert( a + 1 < b, "pointseq.nextPointToKeep - the must be a point between a and b");
			console.assert( b < n, "pointseq.nextPointToKeep - bad parameter b");

			// We create a line segment between a and b, then see if any intermediate points are 
			// too far away (according to allowedError) from that line segment:
			var seg = new lineSeg.LineSeg(originalPts[a], originalPts[b]);
			var c;
			for (c = a + 1; c < b; ++c) {
				//console.log("seg.distanceTo[" + c + "]: " + seg.distanceTo(originalPts[c]));
				if (seg.distanceTo(originalPts[c]) > allowedError) {
					return true;
				}
			}
			return false;
		};
		var nextPointToKeep = function(j) {
			// j is never as far as the last element of the sequence
			console.assert( j < n - 1, "pointseq.nextPointToKeep - bad parameter j");
			console.assert( j >= 0, "pointseq.nextPointToKeep - bad parameter j negative");
			var k = j;
			while (++k < n) {
				if (k - j > 1) {	// Any points between originalPts[j] and originalPts[k] ?
					if (intermedatePointsTooFarAway(j, k)) {
						break;
					}
				}
			}
			// The above loop will always increase k until it finds the point that is too far - so we back up:
			// This means that the returned value (k - 1) is always a valid index for a n element in the array.
			console.assert( k <= n,  "pointseq.nextPointToKeep - bad return value");
			return k - 1;
		}
		if (n > 0) {
			//do {
			while (true) {
				pts.push(this.points[i]);
				if (i === n - 1) {
					break;	// We've just done the last point in the original sequence.
				}
				i = nextPointToKeep(i);
			}
			//} while (i < n);	// Given the above break;, does this test ever get used?
			//console.log(pts);
			return new PointSeq(this.source, {points: pts});
		}
		return null;
	};

	function getAll() {
		return modelObjects;
	}

	var pub = {
		PointSeq: PointSeq,
		getAll: getAll
	};
	return pub;
});

