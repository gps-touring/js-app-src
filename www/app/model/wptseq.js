define( ["model/gpx", "model/userdata", "app/eventbus"], function(gpx, userdata, eventbus) {
	"use strict";

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
		this.source = theSource;
		// The sequence is exprected to be an array of objects, each object supporting some standard accessors
		// for lat, long, ele, etc.
		// TODO - specify this interface more precisely.
		this.seq = theSeq;
		this.id = id;	// Persistent, unique identifier. 

		this.selected = false;
		//	this.hovered = false; // Do we need to store this?

		this.length = this.seq.length;
		this.item = function(i) {
			return this.seq[i];
		};
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
	}

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

