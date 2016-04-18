define(["app/eventbus", "presenter/map/wptseq"], function(eventbus, wptseqPresenter) {
	"use strict";

	var views = [];
	function registerView(v) {
		views.push(v);
		return { };	// return settings
	}
	function onNewWaypointSequence(data/*, envelope*/) {
		//console.log("onNewWaypointSequence");
		var i;
		var seq = data.waypointSequence;
		var latLngs = wptseqPresenter.toLeafletLatLngs(seq);
		for (i = 0; i < views.length; ++i) {
			// Here, we register eventHandlers with each view. If the model changes state
			// as a result of handling these events, we will pick up those state changes in onWaypointSequenceStateChange.
			seq.setUserData({mapView: views[i].addWaypointSequence(latLngs, wptseqPresenter.createEventHandlers(seq))});
		}
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		//console.log("onWaypointSequenceStateChange");

		data.waypointSequence.userdata.mapView.showState(data.state);
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
