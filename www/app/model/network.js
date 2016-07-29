define([], function() {
	"use strict";

	// A Network is a collection of "routes" that form a connected graph.
	// For implementation purposes, a "route" is an object of type PointSeq.
	//
	// Networks are discovered by identifying intersections between "routes" (PointSeq objects).
	// These intersection points, and the PointSeq objects they belong to are also stored with the Network.
	// We allow for the fact that ain intersection point may be at the intersection of more than two PointSeqs
	// (although this is highly unlikely in real situations).
	//
	// Maybe we need a sub-module: model/network/discoverer.js to house the main algorithm?
	//
	function Intersection(/* params tbd*/) {
	}
	function Network() {
	}

	var pub {
	};
	return pub;
});
