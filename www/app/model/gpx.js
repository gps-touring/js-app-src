define( ["model/gpxParse"], function(gpxParse) {
	"use strict";

	// We define a GpxObject in order to associate some methods with the parsedGpx:
	var GpxObject = function(parsedGpx) {
		this.gpx = parsedGpx;
		this.getWaypointSequences = function() {
			var i, j, res = [];
			// console.log(this.gpx);
			// Sequences of Waypoints can come from gpx/trk/trkseg ...
			if (this.gpx.trk) {
				for (i = 0; i < this.gpx.trk.length; ++i) {
					if (this.gpx.trk[i].trkseg) {
						for (j = 0; j < this.gpx.trk[i].trkseg.length; ++j) {
							//res.push(new WaypointSequence(this.gpx.trk[i].trkseg[j].trkpt));
							// TODO - convert the sequence (and each point) into a standard model object.
							res.push(this.gpx.trk[i].trkseg[j].trkpt);
						}
					}
				}
			}
			// ... or from gpx/rte
			if (this.gpx.rte) {
				for (i = 0; i < this.gpx.rte.length; ++i) {
					//res.push(new WaypointSequence(this.gpx.rte[i].rtept));
					// TODO - convert the sequence (and each point) into a standard model object.
					res.push(this.gpx.rte[i].rtept);
				}
			}
			return res;
		};
	};

	function parseGpxStr(str) {
		// Firstly, we get the result of parsing the XML according to the GPX specification:
		var res = gpxParse.parseXmlStr(str);

		// Secondly, we turn it into an object that is accessible using our model's interface:
		if (res !== null) {
			return new GpxObject(res);
		}
		return res;
	}
	var pub = {
		parseGpxStr: parseGpxStr
	};
	return pub;
});
