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
			// Here, we register the model's eventHandlers with each view. If the model changes state
			// as a result of handling these events, we will pick up those state changes in onWaypointSequenceStateChange.
			views[i].showLatLngs(latLngs, seq.eventHandlers, "route");
		}
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		console.log("onWaypointSequenceStateChange");
		//console.log(data.event.target);
		// The path.setStyle({className approach is fundamentally broken!
		// See https://github.com/Leaflet/Leaflet/issues/2662
		// In particular, it does not work after the Path has been added to the map.
		//data.event.target.setStyle({className: data.state.hovered ? "route-hovered" : "route"});

		// And alternative approach (hack) is to use the non-API _path property to manimulate the DOM directly:
		leaflet.DomUtil.removeClass(data.event.target._path, "route");
		leaflet.DomUtil.removeClass(data.event.target._path, "route-hovered");
		leaflet.DomUtil.addClass(data.event.target._path, data.state.hovered ? "route-hovered" : "route");
		//console.log(data.event.target._path.classList);
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
