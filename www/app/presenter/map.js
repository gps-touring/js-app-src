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
				text: "Start from",
				callback: function(e) { pointModel.setStart(e.latlng.lat, e.latlng.lng); console.log("Start from" + e.latlng); }
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
		seq.setUserData({mapView: view.addWaypointSequence(latLngs, wptseqPresenter.createEventHandlers(seq))});
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		//console.log("onWaypointSequenceStateChange");

		data.waypointSequence.userdata.mapView.showState(data.state);
	}
	function onPointAddStart(data/*, envelope*/) {
		var pt = data.point;
		var latlng = [pt.lat, pt.lng];	// Understood by Leaflet.
		// options properties are the options avaiable for Leaflet.awesome-markers.
		// See https://github.com/lvoogdt/Leaflet.awesome-markers
		var options = {icon: "play", markerColor: "green"};
		var eventHandlers = {};
		pt.setUserData({mapView: view.addMarker(latlng, options, eventHandlers)});
	}
	function onPointRemoveStart(data/*, envelope*/) {
		var pt = data.point;
		//pt.setUserData({mapView: view.addMarker(latlng)});
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "WaypointSequence.new", callback: onNewWaypointSequence});
		eventbus.subscribe({topic: "WaypointSequence.stateChange", callback: onWaypointSequenceStateChange});
		eventbus.subscribe({topic: "Point.addStart", callback: onPointAddStart});
		eventbus.subscribe({topic: "Point.removeStart", callback: onPointRemoveStart});
	}
	var pub = {
		registerView: registerView,
		getMapEventHandlers: getMapEventHandlers,
		getContextmenuItems: getContextmenuItems
	};
	init();
	return pub;
});
