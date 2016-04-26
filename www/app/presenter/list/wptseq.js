define(["app/eventbus", "model/wptseq"], function(eventbus, wptseqModel) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}

	function onNewPointSeq(data/*, envelope*/) {
		//console.log("wptseqList: onNewPointSeq");
		//var seq = data.waypointSequence;
		view.refresh(wptseqModel.getAllPointSeqs());
	}
	function onPointSeqStateChange(data/*, envelope*/) {
		//console.log("wptseqList: onPointSeqStateChange");
		view.showState(data.waypointSequence, data.state);
	}

	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "PointSeq.new", callback: onNewPointSeq});
		eventbus.subscribe({topic: "PointSeq.stateChange", callback: onPointSeqStateChange});
	}
	var pub = {
		registerView: registerView
	};
	init();
	return pub;
});
