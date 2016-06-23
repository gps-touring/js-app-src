// TODO - this should really be called view/list/route,
//        and allow the user to choose between the original pointseq, and the simplified pointseq.
//
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
