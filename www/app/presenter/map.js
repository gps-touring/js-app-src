define(["app/eventbus", "model/markers", "presenter/map/pointseq"], function(eventbus, markerModel, pointseqPresenter) {
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
				callback: function(e) {
					markerModel.setMarker(e.latlng.lat, e.latlng.lng, "routeStart", {icon: "play", markerColor: "green"});
				}
			},
			{
				text: "Route to here",
				callback: function(e) {
					markerModel.setMarker(e.latlng.lat, e.latlng.lng, "routeFinish", {icon: "stop", markerColor: "red"});
				}
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
	function onNewPointSeq(data/*, envelope*/) {
		//console.log("onNewPointSeq");
		var seq = data.modelObject;
		var latLngs = pointseqPresenter.toLeafletLatLngs(seq);
		// Here, we register eventHandlers with each view. If the model changes state
		// as a result of handling these events, we will pick up those state changes in onPointSeqStateChange.
		seq.setUserData("mapView", view.addPointSeq(latLngs, pointseqPresenter.createEventHandlers(seq)));
	}
	function onPointSeqStateChange(data/*, envelope*/) {
		//console.log("onPointSeqStateChange");

		data.modelObject.getUserData("mapView").showState(data.state);
	}
	function onPointAdd(data/*, envelope*/) {
		var pt = data.point;
		var latlng = [pt.lat, pt.lng];	// Understood by Leaflet.
		// options properties are the options avaiable for Leaflet.awesome-markers.
		// See https://github.com/lvoogdt/Leaflet.awesome-markers

		// Event handlers for the leaflet Marker:
		var eventHandlers = {
			click: function() {
				//console.log("click Marker");
				//console.log(pt.gpxWpt);
				// TODO - do better than just loggin the GPX to console, like adding it to a set of waypoints that have been selected,
				//        and having an action to generate an entire GPX file from all selected waypoints.
				console.log(pt.toGpx());
			}
		};
		/*
		// Test interaction between click event handlers and bound Popups:
		var eventHandlers = {click: function(e) { 
			console.log("click");
			console.log(e);
		}};
		*/

		pt.setUserData("mapView", view.addMarker(latlng, data.options, eventHandlers));
	}
	function onPointRemove(data/*, envelope*/) {
		data.point.getUserData("mapView").destroy();
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "PointSeq.new", callback: onNewPointSeq});
		eventbus.subscribe({topic: "PointSeq.stateChange", callback: onPointSeqStateChange});
		eventbus.subscribe({topic: "Point.add", callback: onPointAdd});
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
