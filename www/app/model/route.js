// We can have more than one sequence of points for the same route:
//    - the original sequence, loaded from GPX
//    - a simplified sequence, removing unnecessary points.
// These are contained in a Route object.

define( ["model/state", "app/eventbus"], function(state, eventbus) {
	"use strict";

	var eventPrefix = "Route";
	var modelObjects = [];
	var Route = function(pointseq) {
		Object.defineProperties(this, {
			// original PointSeq:
			original: { value: pointseq, enumerable: true},
			// simplified PointSeq, removing unnecessary points:
			simplified: { value: pointseq.simplify(), enumerable: true}	// null if pointseq has no points.
		});
		modelObjects.push(this);

		// TODO - do we need to include mouseStates in this Object, as done for pointseq?

		eventbus.publish({topic: eventPrefix + ".new", data: {modelObject: this}});
	};
	Route.prototype.getPointSeq = function(ptSeqType, flag) {
		switch (ptSeqType) {
			case state.routeTypeEnum.original:
				return flag ? this.original : this.simplified;
			case state.routeTypeEnum.simplified:
				return flag ? this.simplified : this.original;
			default:
				console.assert(false, "model/route: Unknown ptSeqType " + ptSeqType);
				return null;
		}
	};

	function getAll() {
		return modelObjects;
	}
	function getAllPointSeqs(ptSeqType, flag) {
		return modelObjects.map(function(route) { return route.getPointSeq(ptSeqType, flag); });
	}
	function getAllVisiblePointSeqs() {
		return getAllPointSeqs(state.getViewRoutesType(), true);
	}
	function getAllInvisiblePointSeqs() {
		return getAllPointSeqs(state.getViewRoutesType(), false);
	}

	var pub = {
		Route: Route,
		getAll: getAll,
		getAllVisiblePointSeqs: getAllVisiblePointSeqs,
		getAllInvisiblePointSeqs: getAllInvisiblePointSeqs
	};
	return pub;
});
