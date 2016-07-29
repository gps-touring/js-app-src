define( ["view/table", "presenter/list/pointseq"], function(table, presenter) {
	"use strict";

	function init(tabId) {
		presenter.createTable(table, tabId)
	}
	var pub = {
		init: init
	};
	return pub;
});
