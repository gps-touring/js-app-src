define(["leaflet", "app/eventbus"], function(leaflet, eventbus) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
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
				wptseq.setSelected(true);
			};
		},
		mouseover: function(wptseq) {
			return function(e) {
				//console.log("WaypointSequence mouseover: " + e.latlng);
				wptseq.setHovered(true);
			};
		},
		mouseout: function(wptseq) {
			return function(e) {
				//console.log("WaypointSequence mouseout: " + e.latlng);
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
	function onNewWaypointSequence(data/*, envelope*/) {
		//console.log("onNewWaypointSequence");
		var i, j;
		var seq = data.waypointSequence;
		var latLngs = [];
		//console.log(seq.length);
		for (j = 0; j < seq.length; ++j) {
			//console.log(seq.item(j));
			latLngs.push(leaflet.latLng(seq.item(j).lat, seq.item(j).lon));
		}
		for (i = 0; i < views.length; ++i) {
			// Here, we register the model's eventHandlers with each view. If the model changes state
			// as a result of handling these events, we will pick up those state changes in onWaypointSequenceStateChange.
			seq.setUserData({mapView: views[i].addWaypointSequence(latLngs, createEventHandlers(seq))});
		}
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		//console.log("onWaypointSequenceStateChange");

		if (data.state.hovered !== undefined) {
			data.waypointSequence.userdata.mapView.showHovered(data.state.hovered);
		}
	}
	function init() {
		eventbus.subscribe({topic: "WaypointSequence.new", callback: onNewWaypointSequence});
		eventbus.subscribe({topic: "WaypointSequence.stateChange", callback: onWaypointSequenceStateChange});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});
