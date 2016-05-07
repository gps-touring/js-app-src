define( ["model/gpx", "model/userdata", "model/mouseStates", "app/eventbus"], function(gpx, userdata, mouseStates, eventbus) {
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

	function getAll() {
		return modelObjects;
	}

	var pub = {
		PointSeq: PointSeq,
		getAll: getAll
	};
	return pub;
});

