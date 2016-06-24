// This module keeps state changes in one place. (Experimental).
// This is done with a view to being able to save and restor state via the zip file.
define (["app/eventbus"], function(eventbus) {
	"use strict";
	
	// The string values for enum are here for debugging, and for saving/restoring state.
	var viewRouteEnum = Object.freeze({
		// Which PointSeq should be viewed for a Route?
		original: "original",
		simplified: "simplified"
	});
	var config = {
		// Should probably also define a function to validate parameters:
		viewRoutes: { 
			data: viewRouteEnum.simplified, 
			validate: function(data) {
				console.log("TODO - config.viewRoutes.validate");
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
	function changer(s, v) {
		console.assert(config[s], "Unknown state: " + s);
		console.assert(config[s].validate(v), "state.config." + s + " invalid data: " + v);
		return function() {
			setState(s, v);
		};
	}
	// JUst for testing:
	function test(data) {
	   console.log(data);
	}	   
	eventbus.subscribe({ topic: "StateChange.viewRoutes", callback: test} );
	// JUst for testing:
	function viewRoutes(which) {
		return function() {
			config.viewRoutes = which;
			//eventbus.publish({ topic: "StateChange.viewRoutes", data: { source: which } });
		};
	}
	function viewOriginalRoutes() {
		viewRoutes(viewRouteEnum.original);
		eventbus.publish({ topic: "StateChange.viewOriginalRoutes" });
	}
	function viewSimplifiedRoutes() {
		viewRoutes(viewRouteEnum.simplified);
		eventbus.publish({ topic: "StateChange.viewSimplifiedRoutes" });
	}
	var pub = {
		//viewRouteEnum: viewRouteEnum,
		//viewRoutes: viewRoutes,
		changer: changer,
		viewOriginalRoutes: viewOriginalRoutes,
		viewSimplifiedRoutes: viewSimplifiedRoutes
	};
	return pub;
});
