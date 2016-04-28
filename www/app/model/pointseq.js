define( ["model/gpx", "model/userdata", "app/eventbus"], function(gpx, userdata, eventbus) {
	"use strict";

	// Waypoint sequences represent routes (or tracks).
	var store = {
		wptsSeqs: []
	};
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
			// userdata: property created if setUserData is called.
		});
		console.log(this);
	};
	// define a userdata property for PointSeq if setUserData is called:
	PointSeq.prototype.setUserData = userdata.setUserData;
	PointSeq.prototype.getUserData = userdata.getUserData;

	function deselectAll() {
		var i;
		for (i = 0; i < store.wptsSeqs.length; ++i) {
			store.wptsSeqs[i].setSelected(false);
		}
	}

	PointSeq.prototype.setSelected = function (isIt) {
		if (this.selected !== isIt) {
			if (isIt) {
				deselectAll();
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
	PointSeq.prototype.getSourceName = function() {
		return this.source.name;
	};

	var addFromGpx = function(file, gpxData) {
		var i, pointseqs = gpxData.getPointSeqs();
		//console.log("Num of waypoint sequences: " + pointseqs.length);
		for (i = 0; i < pointseqs.length; ++i) {
			var wps = new PointSeq(file, pointseqs[i], store.wptsSeqs.length);
			store.wptsSeqs.push(wps);
			eventbus.publish({topic: "PointSeq.new", data: {pointSeq: wps}});
		}
	};
	function getAll() {
		return store.wptsSeqs;
	}

	var pub = {
		addFromGpx: addFromGpx,
		getAll: getAll
	};
	return pub;
});

