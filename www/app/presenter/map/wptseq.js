define(["leaflet", "app/eventbus"], function(leaflet, eventbus) {
	"use strict";

	// See
	// http://leafletjs.com/reference.html#events
	// http://leafletjs.com/reference.html#event-objects
	// http://leafletjs.com/reference.html#path - the Event types are defined here.
	var eventHandlers = {
		// We need to keep the reference to each waypintSequence (in the model)
		// within (as a closure) each event handler we create:
		click: function(wptseq) {
			return function(e) {
				console.log("WaypointSequence click: " + e.latlng);
				// Tell the model to do something:
				wptseq.setSelected(true);
			};
		},
		mouseover: function(wptseq) {
			return function(e) {
				//console.log("WaypointSequence mouseover: " + e.latlng);
				// Tell the model to do something:
				wptseq.setHovered(true);
			};
		},
		mouseout: function(wptseq) {
			return function(e) {
				//console.log("WaypointSequence mouseout: " + e.latlng);
				// Tell the model to do something:
				wptseq.setHovered(false);
			};
		}
	};
	function createEventHandlers(wptseq) {
		var res = {};
		var i, keys = Object.keys(eventHandlers);
		for (i = 0; i < keys.length; ++i) {
			res[keys[i]] = eventHandlers[keys[i]](wptseq);
		}
		return res;
	}
	function toLeafletLatLngs(seq) {
		var j, latLngs = [];
		for (j = 0; j < seq.length; ++j) {
			latLngs.push(leaflet.latLng(seq.item(j).lat, seq.item(j).lng));
		}
		return latLngs;
	}
	var pub = {
		createEventHandlers: createEventHandlers,
		toLeafletLatLngs: toLeafletLatLngs
	};
	return pub;
});

