define(["app/eventbus", "model/wptseq"], function(eventbus, wptseqModel) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}

	function onNewWaypointSequence(data/*, envelope*/) {
		//console.log("wptseqList: onNewWaypointSequence");
		//var seq = data.waypointSequence;
		view.refresh(wptseqModel.getAllWaypointSequences());
	}
	function onWaypointSequenceStateChange(data/*, envelope*/) {
		//console.log("wptseqList: onWaypointSequenceStateChange");
		view.showState(data.waypointSequence, data.state);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "WaypointSequence.new", callback: onNewWaypointSequence});
		eventbus.subscribe({topic: "WaypointSequence.stateChange", callback: onWaypointSequenceStateChange});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});
