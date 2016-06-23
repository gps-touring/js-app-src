// TODO - this should really be called presenter/list/route,
//        and get its data from model/route.
define(["app/eventbus", "model/pointseq"], function(eventbus, pointseqModel) {
	"use strict";

	// Our view is an instance of a generic Table object:
	var table;
	function createTable(tableView, tabId) {
		table = new tableView.Table({
			parentId: tabId,
			matchKey: function(d) { return d.id; },
			columns: ["id", "points", "distance", "chk"]
		});
	}
	function convertPointSeqForTable(ptSeq) {
		// This prepraes data to be used by view/table, according to the column headings
		// set up in getTableColumns():
		return {
			modelObject: ptSeq,
			title: ptSeq.getSourceName(),
			id: ptSeq.id,
			points: ptSeq.length + " pts",
			distance: (ptSeq.distance / 1000).toFixed(2) + " km",
			// Example to show somewhat crap insertion of a checkbox. TODO - use D3?
			chk: "<label><input type=\"checkbox\" />Chk?</label>"
		};
	}
	function onNewPointSeq(data/*, envelope*/) {
		table.refresh(pointseqModel.getAll().map(convertPointSeqForTable));
	}
	function onPointSeqStateChange(data/*, envelope*/) {
		table.showState(convertPointSeqForTable(data.modelObject), data.state);
	}
	function init() {
		// subscribe to events published by the model:
		eventbus.subscribe({topic: "PointSeq.new", callback: onNewPointSeq});
		eventbus.subscribe({topic: "PointSeq.stateChange", callback: onPointSeqStateChange});
	}
	var pub = {
		createTable: createTable
	};
	init();
	return pub;
});
