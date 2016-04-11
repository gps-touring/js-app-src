define(["leaflet", "app/eventbus"], function(leaflet, eventbus) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	function onNewWaypointSequence(data/*, envelope*/) {
		console.log("onNewWaypointSequence");
		var i, j;
		var seq = data.waypointSequence;
		var latLngs = [];
		//console.log(seq.length);
		for (j = 0; j < seq.length; ++j) {
			//console.log(seq.item(j));
			latLngs.push(leaflet.latLng(seq.item(j).lat, seq.item(j).lon));
		}
		for (i = 0; i < views.length; ++i) {
			views[i].showLatLngs(latLngs, "green", seq.eventHandlers);
		}
	}
	function init() {
		eventbus.subscribe({topic: "WaypointSequence.new", callback: onNewWaypointSequence});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});
