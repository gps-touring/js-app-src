// This module keeps state changes in one place. (Experimental).
// This is done with a view to being able to save and restor state via the zip file.
define (["app/eventbus"], function(eventbus) {
	"use strict";
	
	// The string values for enum are here for debugging, and for saving/restoring state.
	var routeTypeEnum = Object.freeze({
		// Which PointSeq should be viewed for a Route?
		original: "original",
		simplified: "simplified"
	});
	var config = {
		// Should probably also define a function to validate parameters:
		viewRoutes: { 
			data: routeTypeEnum.simplified, 
			validate: function(data) {
				console.log("TODO - config.viewRoutes.validate, or maybe we don't need to?");
				return true;
				//return false;
			}
		}
	}

	// Consider a generalisation.
	// StateChanges require:
	//  - A function to be called to invoke the change of state.
	//  - Optional parameters - an Object.
	//  - A change to the saved state.
	//  - An event to be published (with same name as called function?), with the optional parameters (same Object).
	function setState(s, v) {
		console.assert(config[s], "Unknown state: " + s);
		console.assert(config[s].validate(v), "state.config." + s + " invalid data: " + v);
		config[s].data = v;
		eventbus.publish({ topic: "StateChange." + s, data: v});
	}
	function getState(s) {
		console.assert(config[s], "Unknown state: " + s);
		return config[s].data;
	}
	function changer(s, v) {
		console.assert(config[s], "Unknown state: " + s);
		console.assert(config[s].validate(v), "state.config." + s + " invalid data: " + v);
		return function() {
			setState(s, v);
		};
	}
	// Here we define access functions to hide implementation details. Is this a good way forward?
	function viewOriginalRoutes() {
		setState("viewRoutes", routeTypeEnum.original);
	}
	function viewSimplifiedRoutes() {
		setState("viewRoutes", routeTypeEnum.simplified);
	}
	function getViewRoutesType() {
		return getState("viewRoutes");
	}
	var pub = {
		//changer: changer,
		routeTypeEnum: routeTypeEnum,
		viewOriginalRoutes: viewOriginalRoutes,
		viewSimplifiedRoutes: viewSimplifiedRoutes,
		getViewRoutesType: getViewRoutesType
	};
	return pub;
});
