define( ["app/eventbus", "model/gpxParse", "model/point", "model/pointseq"], function(eventbus, gpxParse, point, pointseq) {
	"use strict";

	function convertGpxWaypointsToModelPoints(gpxWpts) {
		if (!gpxWpts) {
			return [];
		}
		return gpxWpts.map(function(e) {
			// We only want to pass the gpx wpt data (e) into the Point if there is more in it than just the
			// lat, lon, and (optionally) ele properties.
			// We assume that lat and lon are always there (else it's ill-defined GPX wpt).
			var len = Object.keys(e).length;
			var wptHasAdditionalInfo = len > 3 || (e.ele === undefined && len > 2);
			//if (wptHasAdditionalInfo) console.log(e);
			var gpxWpt = wptHasAdditionalInfo ? e : undefined;
			var pt = new point.Point(e.lat, e.lon, e.ele, {gpxWpt: gpxWpt});
			return pt;
		});
	}

	var modelObjects = [];

	// Construct a Gpx object from a string:
	function Gpx(file, str) {
		var parsed = gpxParse.parseXmlStr(str);
		var pointSeqs = [];
		var waypoints = [];
		var ptSeq;
		var pts = null;
		var newpts = null;
		if (parsed.trk) {
			parsed.trk.forEach( function(trk) {
				// We want to merge <trkseg>s when the start of one trkseg matches the end of the previous trkseg.
				// This deals with some poorly considered GPX files in which every pair of points is put into its own trkseg
				// (silly, but I have seen examples) - this can mean thousands of PointSeq object which can overwhelm the UI.
				pts = [];	// Gather together points from consecutive trksegs (where next trkseg continues from preious trkseg)
				trk.trkseg.forEach( function(trkseg) {
					newpts = convertGpxWaypointsToModelPoints(trkseg.trkpt);
					if (newpts.length > 0) {
						if (pts.length == 0) {
							pts = newpts;
						}
						else if (pts[pts.length - 1].isSameLatLng(newpts[0])) {
							// newpts continue on from pts.
							// We leave the end of pts and the start of newpts in tact (even though they have the same lat an lng)
							// in case there's other info in the <wpt> that differs between these two points.
							// This duplication will be removed by PointSeq.simplify().
							Array.prototype.push.apply(pts, newpts);
						}
						else {
							// Both pts and newpts contain points, but newpts does not continue from the end of pts.
							// Save what's already stored in pts:
							pointSeqs.push(new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, {points: pts}));
							// Start gathering another sequence, 
							pts = newpts;
						}
					}
					else {
						// Empty <trkseg> - nothing to do.
					}
				});
				// The last sequence of points from continuing trksegs still needs to be saved:
				if (pts.length > 0) {
					pointSeqs.push(new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, {points: pts}));
				}
			});
		}
		if (parsed.rte) {
			parsed.rte.forEach( function(rte) {
				ptSeq = new pointseq.PointSeq(pointseq.typeEnum.gpx, file.name, {
					points: convertGpxWaypointsToModelPoints(rte.rtept)
				});
				pointSeqs.push(ptSeq);
			});
		}
		if (parsed.wpt) {
			waypoints = convertGpxWaypointsToModelPoints(parsed.wpt);
			eventbus.publish({
				topic: "Waypoints.add",
				data: {
					waypoints: waypoints,
					fileName: file.name
				}
			});
		}

		Object.defineProperties(this, {
			pointSeqs: { value: pointSeqs, enumerable: true},
			waypoints: { value: waypoints, enumerable: true}
		});
	}
	Gpx.prototype.simplifyPtSeqs = function(name) {
		return pointseq.createSimplified(name, this.pointSeqs);
	};
	var pub = {
		Gpx: Gpx
	};
	return pub;
});
