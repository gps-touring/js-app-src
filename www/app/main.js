define(
	["app/console", "d3", "app/view", "app/debug", "model/btree/test"],
	function(myconsole, d3, view, debugging, btreetest){
	"use strict";

	// We're using the Definitive Module Pattern:
	// https://github.com/tfmontague/definitive-module-pattern
	var priv = {
		init: function() {
			d3.select("head").select("title").text("GPS Touring");

			// The code for each view is loaded by www/app/view.js
			// Initialize the views:
			view.init();

			// Each view will ensure that the code for its presenter is loaded.

			// Tests
			btreetest.test();
		}
	};
	var pub = {
		init: priv.init
	};
	return pub;
});

