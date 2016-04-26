define(["app/eventbus", "model/pointseq"], function(eventbus, pointseqModel) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}

	function onNewPointSeq(data/*, envelope*/) {
		//console.log("pointseqList: onNewPointSeq");
		//var seq = data.pointSeq;
		view.refresh(pointseqModel.getAllPointSeqs());
	}
	function onPointSeqStateChange(data/*, envelope*/) {
		//console.log("pointseqList: onPointSeqStateChange");
		view.showState(data.pointSeq, data.state);
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
