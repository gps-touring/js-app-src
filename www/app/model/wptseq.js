define( ["model/gpx", "app/eventbus"], function(gpx, eventbus) {
	"use strict";

	// A Sequence of waypoints is a core part of the model: it is what defined a section of a route.

	var WaypointSequence = function(theSource, theSeq) {
		this.source = theSource;

		// The sequence is exprected to be an array of objects, each object supporting some standard accessors
		// for lat, long, ele, etc.
		// TODO - specify this interface more precisely.
		this.seq = theSeq;
		console.log("model/wptseq/WaypointSequence:");
		console.log(this.seq);

		this.toLatLngs = function() {
			var res = [];
			return res;
		};
		this.length = this.seq.length;
		this.item = function(i) {
			return this.seq[i];
		};
	};
	var store = {
		wptsSeqs: []
	};

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

