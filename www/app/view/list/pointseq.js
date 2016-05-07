define( ["view/table", "presenter/list/pointseq"], function(table, presenter) {
	"use strict";

	var settings;

	var table;
	function init(tabId) {
		table = new table.Table({
			parentId: tabId,
			matchKey: function(d) { return d.id; },
			columns: ["id", "points", "distance"]
		});
		// NOTE unusual parameter passed to registerView, and the fact that
		//      it is being called in a non-standard place.
		settings = presenter.registerView(table);
	}
	var pub = {
		init: init
	};
	return pub;
});
