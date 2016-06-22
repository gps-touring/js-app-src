// We can have more than one sequence of points for the same route:
//    - the original sequence, loaded from GPX
//    - a simplified sequence, removing unnecessary points.
// These are contained in a Route object.

define( ["model/pointseq"], function(pointseq) {
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

	function getAll() {
		return modelObjects;
	}

	var pub = {
		Route: Route,
		getAll: getAll
	};
	return pub;
});
