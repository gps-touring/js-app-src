define( ["app/eventbus", "model/gpxParse", "model/point"], function(eventbus, gpxParse, point) {
	"use strict";

	function convertGpxWaypointsToModelPoints(gpxWpts) {
		return gpxWpts.map(function(e) {
			// We only want to pass the gpx wpt data (e) into the Point if there is more in it than just the
			// lat, lon, and (optionally) ele properties.
			// We assume that lat and lon are always there (else it's ill-defined GPX wpt).
			var len = Object.keys(e).length;
			var wptHasAdditionalInfo = len > 3 || (e.ele === undefined && len > 2);
			var gpxWpt = wptHasAdditionalInfo ? e : undefined;
			var pt = new point.Point(e.lat, e.lon, e.ele, {gpxWpt: gpxWpt});
			if (wptHasAdditionalInfo) {
				console.log("Waypoint with extra data:");
				console.log(e);
				// icon taken from http://fortawesome.github.io/Font-Awesome/icons/
				eventbus.publish({
					topic: "Point.add",
					data: {
						point: pt,
						options: {cluster: true, icon: "map-signs", markerColor: "blue"}
					}
				});
			}
			return pt;
		});
	}

	// We define a GpxObject in order to associate some methods with the parsedGpx:
	var GpxObject = function(parsedGpx) {
		this.gpx = parsedGpx;
		this.getPointSeqs = function() {
			var i, j, res = [];
			// console.log(this.gpx);
			// Sequences of Waypoints can come from gpx/trk/trkseg ...
			if (this.gpx.trk) {
				for (i = 0; i < this.gpx.trk.length; ++i) {
					if (this.gpx.trk[i].trkseg) {
						for (j = 0; j < this.gpx.trk[i].trkseg.length; ++j) {
							// TODO - convert the sequence (and each point) into a standard model object.

							res.push({
								points: convertGpxWaypointsToModelPoints(this.gpx.trk[i].trkseg[j].trkpt),
								gpxTrk: this.gpx.trk[i]
							});
						}
					}
				}
			}
			// ... or from gpx/rte
			if (this.gpx.rte) {
				for (i = 0; i < this.gpx.rte.length; ++i) {
					// TODO - convert the sequence (and each point) into a standard model object.
					res.push({
						points: convertGpxWaypointsToModelPoints(this.gpx.rte[i].rtept),
						gpxRte: this.gpx.rte[i]
					});
				}
			}
			return res;
		};
		this.getWaypoints = function() {
			var i, j, res = [];
			if (this.gpx.wpt) {
				res.push({
					points: convertGpxWaypointsToModelPoints(this.gpx.wpt)
				});
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
