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
	function deselectAllPointSeqs() {
		var i;
		for (i = 0; i < store.wptsSeqs.length; ++i) {
			store.wptsSeqs[i].setSelected(false);
		}
	}

	// A Sequence of waypoints is a core part of the model: it is what defines a section of a route.

	var PointSeq = function(theSource, theSeq, id) {
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
	PointSeq.prototype.setSelected = function (isIt) {
		if (this.selected !== isIt) {
			if (isIt) {
				deselectAllPointSeqs();
			}
			this.selected = isIt;
			eventbus.publish({
				topic: "PointSeq.stateChange",
				data: {
					pointSeq: this,
					state: {selected: this.selected}
				}
			});
		}
	};
	PointSeq.prototype.setHovered = function (isIt) {
		eventbus.publish({
			topic: "PointSeq.stateChange",
			data: {
				pointSeq: this,
				state: {hovered: isIt, selected: this.selected}
			}
		});
	};
	PointSeq.prototype.setUserData = userdata.setUserData;
	PointSeq.prototype.getUserData = userdata.getUserData;
	PointSeq.prototype.getSourceName = function() {
		return this.source.name;
	};

	var addFromGpx = function(file, gpxData) {
		var i, wptseqs = gpxData.getPointSeqs();
		//console.log("Num of waypoint sequences: " + wptseqs.length);
		for (i = 0; i < wptseqs.length; ++i) {
			var wps = new PointSeq(file, wptseqs[i], store.wptsSeqs.length);
			store.wptsSeqs.push(wps);
			eventbus.publish({topic: "PointSeq.new", data: {pointSeq: wps}});
		}
	};
	function getAllPointSeqs() {
		return store.wptsSeqs;
	}

	var pub = {
		addFromGpx: addFromGpx,
		getAllPointSeqs: getAllPointSeqs
	};
	return pub;
});

