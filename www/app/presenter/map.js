define(["app/eventbus", "model/points", "presenter/map/wptseq"], function(eventbus, pointModel, wptseqPresenter) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}
	function getContextmenuItems() {
		return [
			{
				text: "Route from here",
				callback: function(e) { pointModel.setStart(e.latlng.lat, e.latlng.lng); }
			},
			{
				text: "Route to here",
				callback: function(e) { pointModel.setFinish(e.latlng.lat, e.latlng.lng); }
			},
			{
				text: "Launch Google maps",
				callback: function(e) {
					// Documentation of Google maps URL parameters from here:
					// https://moz.com/ugc/everything-you-never-wanted-to-know-about-google-maps-parameters
					// Example:
					// https://www.google.co.uk/maps?q=loc:49.8764953,1.1566544&z=14&t=p

					var params = [
						// TODO - put a marker on Google maps at e.latlng.
						//"q=loc:" puts a marker on the map, BUT ignores the z and t parameters. Hmmm.
						//"q=loc:" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
						"ll=" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7),
						"z=14", // zoom. TODO: Consider matching with current view?
						"t=p" 	// for terrain map
					];
					var url = "https://www.google.co.uk/maps?" + params.join("&");

					// This version of the URL also works (and is more modern?). 
					// But I have not worked out how to specify a terrain map, nor markers.
					//var zoom = 14;
					//var url = "https://www.google.co.uk/maps/@" + e.latlng.lat.toFixed(7) + "," + e.latlng.lng.toFixed(7) + "," + zoom + "z";
					console.log(url);
					window.open(url, "_blank");
				}
			}
		];
	}
	function getMapEventHandlers() {
		return {
			click: function(e) { console.log("Map clicked" + e.latlng); }
		};
	}
	function onNewWaypointSequence(data/*, envelope*/) {
		//console.log("onNewWaypointSequence");
		var seq = data.waypointSequence;
		var latLngs = wptseqPresenter.toLeafletLatLngs(seq);
		// Here, we register eventHandlers with each view. If the model changes state
		// as a result of handling these events, we will pick up those state changes in onWaypointSequenceStateChange.
		seq.setUserData("mapView", view.addWaypointSequence(latLngs, wptseqPresenter.createEventHandlers(seq)));
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		//console.log("onWaypointSequenceStateChange");

		data.waypointSequence.getUserData("mapView").showState(data.state);
	}
	function addMarkerToView(data, options) {
		var pt = data.point;
		var latlng = [pt.lat, pt.lng];	// Understood by Leaflet.
		// options properties are the options avaiable for Leaflet.awesome-markers.
		// See https://github.com/lvoogdt/Leaflet.awesome-markers
		var eventHandlers = {};
		pt.setUserData("mapView", view.addMarker(latlng, options, eventHandlers));
	}
	function removeMarkerFromView(data) {
		data.point.getUserData("mapView").destroy();
	}
	function onPointAddStart(data/*, envelope*/) {
		addMarkerToView(data, {icon: "play", markerColor: "green"});
	}
	function onPointAddFinish(data/*, envelope*/) {
		addMarkerToView(data, {icon: "stop", markerColor: "red"});
	}
	function onPointRemove(data/*, envelope*/) {
		removeMarkerFromView(data);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "WaypointSequence.new", callback: onNewWaypointSequence});
		eventbus.subscribe({topic: "WaypointSequence.stateChange", callback: onWaypointSequenceStateChange});
		eventbus.subscribe({topic: "Point.addStart", callback: onPointAddStart});
		eventbus.subscribe({topic: "Point.addFinish", callback: onPointAddFinish});
		eventbus.subscribe({topic: "Point.remove", callback: onPointRemove});
	}
	var pub = {
		registerView: registerView,
		getMapEventHandlers: getMapEventHandlers,
		getContextmenuItems: getContextmenuItems
	};
	init();
	return pub;
});
