define( ["util/xml", "model/point", "model/lineSeg", "model/userdata", "model/mouseStates", "model/state", "app/eventbus"], function(xml, point, lineSeg, userdata, mouseStates, state, eventbus) {
	"use strict";

	var eventPrefix = "PointSeq";

	// There are different kinds of PointSeq, some of which are derived from others.
	// gpx - created directly from a GPX file
	// simplified - derived from gpx, but remove unnecessary points, and lat/lng precision reduced.
	var typeEnum = Object.freeze({
		gpx: "gpx",
		simplified: "simplified"
	});
	

	var modelObjects = [];
	// PointSeq represents a sequence of waypoints defining a path.
	// It may, for example, be created from GPX <rte> or <trk>/<trkseg>. 

	var PointSeq = function(type, name, theSeq) {
		var cache = {
			distance: null
		};
		Object.defineProperties(this, {
			type: { value: type, enumerable: true },
			name: { value: name, enumerable: true },
			points: {value: theSeq.points, enumerable: true },
			id: {value: modelObjects.length, enumerable: true },
			length: { value: theSeq.points.length, enumerable: true },
			distance: {
				get: function() {
					if (cache.distance === null) {
						cache.distance = this.getDistance();
					}
					return cache.distance;
				}
			}
			// userdata: property created if setUserData is called.
		});
		// mouseStates defines some properties (currently, 1 property, "selected") for our modelObject:
		Object.defineProperties(this, mouseStates.objectProperties);
		//console.log(this);
		modelObjects.push(this);
		eventbus.publish({topic: eventPrefix + ".new", data: {modelObject: this}});
	};
	// define a userdata property for PointSeq if setUserData is called:
	PointSeq.prototype.setUserData = userdata.setUserData;
	PointSeq.prototype.getUserData = userdata.getUserData;

	// mouseStates will create functions for this module, which are configured
	// by parameters for use by this module:
	PointSeq.prototype.setSelected = mouseStates.setSelected(eventPrefix, modelObjects);
	PointSeq.prototype.clearSelections = mouseStates.clearSelections(modelObjects);
	PointSeq.prototype.setHovered = mouseStates.setHovered(eventPrefix);

	PointSeq.prototype.getDistance = function() {
		var pts = this.points;
		var i, len = pts.length;
		var res = 0;
		for (i = 1; i < len; ++i) {
			res += pts[i - 1].distanceTo(pts[i]);
		}
		//console.log("PointSeq.getDistance, " + len + " points, " + res + " metres");
		return res;
	};
	PointSeq.prototype.toGpx = function() {
		var cummDist = 0;
		var lastPt  = null;
		return xml.xml("gpx",
					   {
						   xmlns: "http://www.topografix.com/GPX/1/1",
						   version: "1.1",
						   creator: "https://github.com/gps-touring/js-app-src"
					   },
					   xml.xml("rte", {}, 
							   this.points.map(function(p) { 
								   cummDist += lastPt ? lastPt.distanceTo(p) : 0;
								   lastPt = p;
								   return xml.xml("rtept", p.gpxAttrs(), p.rteptXml(cummDist));
							   }).join(""))
					  );
	};
	function simplifiedPoint(pt) {
		return new point.Point(pt.lat, pt.lng, pt.ele, {});
	}
	function simplify(originalPts, allowedError) {
		// To reduce the size of GPX files, remove points that contribute little to the path.
		// An intermediate point will be omitted if it lies less than allowedError distance 
		// from the sequence of points we get by omitting it.
		var pts = [];	// New sequence of points
		var i = 0;
		var n = originalPts.length;
		var intermedatePointsTooFarAway = function(a, b) {	// a, b are indices of originalPts
			console.assert( a >= 0, "pointseq.nextPointToKeep - bad parameter a negative");
			console.assert( a + 1 < b, "pointseq.nextPointToKeep - the must be a point between a and b");
			console.assert( b < n, "pointseq.nextPointToKeep - bad parameter b");

			// We create a line segment between a and b, then see if any intermediate points are 
			// too far away (according to allowedError) from that line segment:
			var seg = new lineSeg.LineSeg(originalPts[a], originalPts[b]);
			var c;
			for (c = a + 1; c < b; ++c) {
				//console.log("seg.distanceTo[" + c + "]: " + seg.distanceTo(originalPts[c]));
				if (seg.distanceTo(originalPts[c]) > allowedError) {
					return true;
				}
			}
			return false;
		};
		var nextPointToKeep = function(j) {
			// j is never as far as the last element of the sequence
			console.assert( j < n - 1, "pointseq.nextPointToKeep - bad parameter j");
			console.assert( j >= 0, "pointseq.nextPointToKeep - bad parameter j negative");
			var k = j;
			while (++k < n) {
				if (k - j > 1) {	// Any points between originalPts[j] and originalPts[k] ?
					if (intermedatePointsTooFarAway(j, k)) {
						break;
					}
				}
			}
			// The above loop will always increase k until it finds the point that is too far - so we back up:
			// This means that the returned value (k - 1) is always a valid index for a n element in the array.
			console.assert( k <= n,  "pointseq.nextPointToKeep - bad return value");
			return k - 1;
		}
		if (n > 0) {
			i = 0;
			while (true) {
				pts.push(simplifiedPoint(originalPts[i]));
				if (i === n - 1) {
					break;	// We've just done the last point in the original sequence.
				}
				i = nextPointToKeep(i);
			}
		}
		return pts;
	}
	function addMilestones(originalPts, milesoneDistanceKm) {
		// NB This function modifies the first and last of originalPts, adding milesones to them.
		// Intermediate milestones are added as new Points.
		var pts = [];	// New sequence of points
		var i = 0;
		var n = originalPts.length;
		var milestoneDistance = milesoneDistanceKm * 1000;
		var lastMilestone = 0;	// metres
		var cummDistance = 0;	// metres
		var lastPt;
		var pt, msPt;
		var dist;
		var d;
		if (n > 0) {
			//  Add milestone to first point in originalPts, then push it onto new pts:
			pt = originalPts[i];
			pt.setMilestone(cummDistance);
			pts.push(pt);
			while (++i < n) {	// Go through all intermediate points in originalPts
				lastPt = pt;
				pt = originalPts[i];
				dist = lastPt.distanceTo(pt);
				while (cummDistance + dist - lastMilestone >= milestoneDistance) {
					// Need to add a new milestone.
					// We use a while loop in case more than one milestone needs to be added before
					// we reach point pt.

					//lastMilestone is the distance to the new milestone:
					lastMilestone += milestoneDistance;

					// d is the proportion of the distance between lastPt and pt where the new milestone to be placed:
					d = (lastMilestone - cummDistance)/dist;
					console.assert(d > 0 && d <= 1.0);

					// Create the milestone at d*100% of the distance between lastPt and pt:
					msPt = new point.Point(
						(Number(lastPt.lat) + (Number(pt.lat) - Number(lastPt.lat)) * d).toFixed(5),
						(Number(lastPt.lng) + (Number(pt.lng) - Number(lastPt.lng)) * d).toFixed(5),
						(Number(lastPt.ele) + (Number(pt.ele) - Number(lastPt.ele)) * d).toFixed(5),
						{});
					msPt.setMilestone(lastMilestone);
					pts.push(msPt);

					// Update cummDistance to include the distance to this new milestone:
					cummDistance += lastPt.distanceTo(msPt);

					// The lastPt added is not the new milestone:
					lastPt = msPt;

					// dist is the distance from the new milesone to the next point pt from originalPts:
					// This is needed for the test in this while loop.
					dist = lastPt.distanceTo(pt);
				}
				cummDistance += lastPt.distanceTo(pt);
				if (i === n - 1) {
					//  Add milestone to last point in originalPts, then push it onto new pts:
					pt.setMilestone(cummDistance);
				}
				pts.push(pt);
			}
		}
		return pts;
	}
	function createSimplified(name, ptSeqs) {
		var i = 0;
		var allowedError = 5;	// metres
		var milesoneDistance = 10;	// km
		var pts;
		return ptSeqs.map(function(ptSeq) { 
			//return ptSeq.simplify(name + "_" + i++);
			pts = simplify(ptSeq.points, allowedError);
			pts = addMilestones(pts, milesoneDistance);
			return new PointSeq(typeEnum.simplified, name + "_" + i++, {points: pts});
		});
	}
	PointSeq.prototype.isOfType = function(type, flag) {
		switch(type) {
			// TODO - Consider whether we need routeTypeEnum as well as typeEnum (I think not!)
			case state.routeTypeEnum.original:
				return flag === (this.type === typeEnum.gpx);
			case state.routeTypeEnum.simplified:
				return flag === (this.type === typeEnum.simplified);
			default:
				console.assert(false, "Unknown ptSeqType " + type);
			return null;
		}
	};

	function getAllOfType(ptSeqType, flag) {
		return modelObjects.filter(function(ptSeq) { return ptSeq.isOfType(ptSeqType, flag); });
	}
	function getAllSimplified() {
		return getAllOfType(state.routeTypeEnum.simplified, true);
	}
	function getAllVisible() {
		return getAllOfType(state.getViewRoutesType(), true);
	}
	function getAllInvisible() {
		return getAllOfType(state.getViewRoutesType(), false);
	}
	function getAll() {
		return modelObjects;
	}

	var pub = {
		PointSeq: PointSeq,
		typeEnum: typeEnum,
		createSimplified: createSimplified,
		getAllSimplified: getAllSimplified,
		getAllVisible: getAllVisible,
		getAllInvisible: getAllInvisible,
		getAll: getAll
	};
	return pub;
});

