define([], function() {
	"use strict";

	function xml(tag, attr, ele) {
		if (!attr) attr = {};
		if (!ele) ele = "";
		return "<" + tag +
			Object.keys(attr).map(function(a) { return " " + a + "=\"" + attr[a] + "\"" }).join("") +
			">" + ele + "</" + tag + ">\n";
	}
	var pub = {
		xml: xml
	};
	return pub;
});
