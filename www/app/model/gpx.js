define( ["app/eventbus", "model/gpxParse", "model/point", "model/pointseq", "model/route"], function(eventbus, gpxParse, point, pointseq, route) {
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
			var gpxWpt = wptHasAdditionalInfo ? e : undefined;
			var pt = new point.Point(e.lat, e.lon, e.ele, {gpxWpt: gpxWpt});
			// TODO - for consistecy with other model objects, 
			//        the Point should publish it's own existence itself.
			//        Need to check any other places where Point.add is published.
			if (wptHasAdditionalInfo) {
				//console.log("Waypoint with extra data:");
				//console.log(e);
				// icon taken from http://fortawesome.github.io/Font-Awesome/icons/
				eventbus.publish({
					topic: "Marker.add",
					data: {
						point: pt,
						options: {
							cluster: true,
							icon: "map-signs",
							hovertext: e.name,
							markerColor: "blue"
						}
					}
				});
			}
			return pt;
		});
	}

	var eventPrefix = "Gpx";	// obsolete?
	var modelObjects = [];

	// Construct a Gpx object from a string:
	function Gpx(file, str) {
		var parsed = gpxParse.parseXmlStr(str);
		var routes = [];
		var pointSeqs = [];	// TODO - make this obsolete, now that we have routes.
		var waypoints = [];
		var ptSeq;
		if (parsed.trk) {
			parsed.trk.forEach( function(trk) {
				trk.trkseg.forEach( function(trkseg) {
					ptSeq = new pointseq.PointSeq(file, {
						points: convertGpxWaypointsToModelPoints(trkseg.trkpt),
						gpxTrk: trk
					});
					routes.push(new route.Route(ptSeq));
					pointSeqs.push(ptSeq);
				});
			});
		}
		if (parsed.rte) {
			parsed.rte.forEach( function(rte) {
				ptSeq = new pointseq.PointSeq(file, {
					points: convertGpxWaypointsToModelPoints(rte.rtept),
					gpxRte: rte
				});
				routes.push(new route.Route(ptSeq));
				pointSeqs.push(ptSeq);
			});
		}
		waypoints = convertGpxWaypointsToModelPoints(parsed.wpt);

		Object.defineProperties(this, {
			routes: { value: routes, enumerable: true},
			pointSeqs: { value: pointSeqs, enumerable: true},
			waypoints: { value: waypoints, enumerable: true}
		});
	}
	Gpx.prototype.simplifyRoutes = function() {
		// We build up an array of PointSeq objects.
		// If the original GPX file had consecutive (end of one matched beginning of next) routes,
		// then these will be merged into a single pointSeq. 
		// This is common for the separate <trkseg> elements of a <trk>.
		var ptSeqs = [];
		var ptSeq = []; // Working space to merge consecutive routes
		var prevEnd = {lat: null, lng: null };	// Keep track of previous end point.
		// TODO - finish this!
		console.log("model/gpx: simplifyRoutes() - work in progress.");
		this.pointSeqs.forEach(function(e) {
			if (e.points[0].lat === prevEnd.lat && e.points[0].lng === prevEnd.lng) {
				ptSeq = ptSeq.concat(e.points);
			}
			else {
				// 1. create new simplified PointSeq from ptSeq and add it to ptSeqs - unless it's empty
				// 2. Re-initialize ptSeq from e.
			}
		});
		// 3. create new simplified PointSeq from ptSeq and add it to ptSeqs - unless it's empty
		return ptSeqs;
	};
	var pub = {
		Gpx: Gpx
	};
	return pub;
});
