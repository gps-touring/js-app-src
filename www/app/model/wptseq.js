define( ["model/gpx", "model/userdata", "app/eventbus"], function(gpx, userdata, eventbus) {
	"use strict";

	// Waypoint sequences represent routes (or tracks).
	// The minimum data in a WaypopintSequence is an array of points {pts: [ ... ]}
	// Optional information:
	//    property      type
	//    file			File. See https://developer.mozilla.org/en-US/docs/Web/API/File
	//    gpxRte		object returned by gpxParse to represent a route <rte>
	//    gpxTrkseg		object returned by gpxParse to represent a track segment <trkseg>
	var store = {
		wptsSeqs: []
	};
	function deselectAllWaypointSequences() {
		var i;
		for (i = 0; i < store.wptsSeqs.length; ++i) {
			store.wptsSeqs[i].setSelected(false);
		}
	}

	// A Sequence of waypoints is a core part of the model: it is what defines a section of a route.

	var WaypointSequence = function(theSource, theSeq, id) {
		Object.defineProperties(this, {
			source: { value: theSource, enumerable: true },
			points: {value: theSeq.points, enumerable: true },
			id: {value: id, enumerable: true },
			gpxRte: { value: theSeq.gpxRte, enumerable: true },
			gpxTrk: { value: theSeq.gpxTrk, enumerable: true },
			selected: { value: false, enumerable: true, writable: true },
			length: { value:theSeq.points.length, enumerable: true }
		});
		console.log(this);
	};
	WaypointSequence.prototype.setSelected = function (isIt) {
		if (this.selected !== isIt) {
			if (isIt) {
				deselectAllWaypointSequences();
			}
			this.selected = isIt;
			eventbus.publish({
				topic: "WaypointSequence.stateChange",
				data: {
					waypointSequence: this,
					state: {selected: this.selected}
				}
			});
		}
	};
	WaypointSequence.prototype.setHovered = function (isIt) {
		eventbus.publish({
			topic: "WaypointSequence.stateChange",
			data: {
				waypointSequence: this,
				state: {hovered: isIt, selected: this.selected}
			}
		});
	};
	WaypointSequence.prototype.setUserData = userdata.setUserData;
	WaypointSequence.prototype.getUserData = userdata.getUserData;
	WaypointSequence.prototype.getSourceName = function() {
		return this.source.name;
	};

	var addFromGpx = function(file, gpxData) {
		var i, wptseqs = gpxData.getWaypointSequences();
		//console.log("Num of waypoint sequences: " + wptseqs.length);
		for (i = 0; i < wptseqs.length; ++i) {
			var wps = new WaypointSequence(file, wptseqs[i], store.wptsSeqs.length);
			store.wptsSeqs.push(wps);
			eventbus.publish({topic: "WaypointSequence.new", data: {waypointSequence: wps}});
		}
	};
	function getAllWaypointSequences() {
		return store.wptsSeqs;
	}

	var pub = {
		addFromGpx: addFromGpx,
		getAllWaypointSequences: getAllWaypointSequences
	};
	return pub;
});

