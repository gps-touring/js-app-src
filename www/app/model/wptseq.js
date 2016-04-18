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

	// A Sequence of waypoints is a core part of the model: it is what defined a section of a route.

	var WaypointSequence = function(theSource, theSeq) {
		this.source = theSource;
		this.selected = false;
		//	this.hovered = false; // Do we need to store this?

		// The sequence is exprected to be an array of objects, each object supporting some standard accessors
		// for lat, long, ele, etc.
		// TODO - specify this interface more precisely.
		this.seq = theSeq;
		//console.log("model/wptseq/WaypointSequence:");
		//console.log(this.seq);

		this.length = this.seq.length;
		this.item = function(i) {
			return this.seq[i];
		};
		this.setHovered = function (isIt) {
			eventbus.publish({
				topic: "WaypointSequence.stateChange",
				data: {
					waypointSequence: this,
					state: {hovered: isIt, selected: this.selected}
				}
			});
		};
		this.setSelected = function (isIt) {
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
	};
	// TODO - make the above methods of WaypointSequence use the prototype mechanism, below.
	WaypointSequence.prototype.setUserData = userdata.setUserData;
	WaypointSequence.prototype.getUserData = userdata.getUserData;

	var addFromGpx = function(file, gpxData) {
		var i, wptseqs = gpxData.getWaypointSequences();
		console.log("Num of waypoint sequence: " + wptseqs.length);
		for (i = 0; i < wptseqs.length; ++i) {
			var wps = new WaypointSequence(file, wptseqs[i]);
			store.wptsSeqs.push(wps);
			eventbus.publish({topic: "WaypointSequence.new", data: {waypointSequence: wps}});
		}
	};

	var pub = {
		addFromGpx: addFromGpx
	};
	return pub;
});

