define(["app/eventbus", "model/pointseq"], function(eventbus, pointseqModel) {
	"use strict";

	var view;
	function registerView(v) {
		view = v;
		return { };	// return settings
	}
	function convertPointSeqForView(ptSeq) {
		return {
			modelObject: ptSeq,
			title: ptSeq.getSourceName(),
			id: ptSeq.id,
			points: ptSeq.length + " pts",
			distance: (ptSeq.distance / 1000).toFixed(2) + " km"
		};
	}

	function onNewPointSeq(data/*, envelope*/) {
		//console.log("pointseqList: onNewPointSeq");
		//var seq = data.modelObject;
		view.refresh(pointseqModel.getAll().map(convertPointSeqForView));
	}
	function onPointSeqStateChange(data/*, envelope*/) {
		//console.log("pointseqList: onPointSeqStateChange");
		view.showState(convertPointSeqForView(data.modelObject), data.state);
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
