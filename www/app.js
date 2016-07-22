requirejs.config({
	// By default, load modules from the lib directory:
    baseUrl: "lib",
    // except, if the module ID starts with "app",
    // load it from the app directory. Paths
    // config is relative to the baseUrl, and
    // never includes a ".js" extension since
    // the paths config could be for a directory.
    paths: {
        app: "../app",
		view: "../app/view",
		stubview: "../app/stubview",	// for testing
		model: "../app/model",
		presenter: "../app/presenter",
		data: "../app/data",
		util: "../app/util",

		// If we want to load D3 from a local source:
		//d3: "d3.v3.min"
		// We want to load external libs from a CDN to take advantage of cacheing by the user's browser:
		//d3: "http://d3js.org/d3.v3.min",
		//topojson: "http://d3js.org/topojson.v1.min",
		d3: "https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.16/d3.min",
		//topojson: "https://cdnjs.cloudflare.com/ajax/libs/topojson/1.6.19/topojson.min",

		// postal depends on lodash.
		// Adding this module definition here seems to satisfy postal's dependency:
		//lodash: "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min",

		// postal.lodash includes some of lodash, but only what is needed by postal:
		// Unfortunately this approach does not work, which is why we're pulling in all of lodash, above.
		//postal: "postal.lodash.min",
		//postal: "https://cdnjs.cloudflare.com/ajax/libs/postal.js/1.0.7/postal.min",
		postal: "postal.min",
		lodash: "lodash.core",

		// In order to allow requireJs to have dependencies on JSON files, we need to pull in the require/json plugin:
		//json: "require/json",
		// The require/json plugin depends on text:
		//text: "text"

		//leaflet: "leaflet",
		leaflet: "leaflet.1.0.0.rc1",
		leafletAwesomeMarkers: "leaflet.awesome-markers.min",

		// See https://stuk.github.io/jszip/
		jszip: "jszip.min",
		FileSaver: "FileSaver.min"
    }
});

requirejs(["app/main"], function(main) {
	"use strict";
	console.log("app/main.js has been loaded");
	main.init();
});
