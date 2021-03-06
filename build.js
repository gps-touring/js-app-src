// Config file for the r.js optimiser.
//
// Docs: 	http://requirejs.org/docs/optimization.html
// Example: https://github.com/jrburke/r.js/blob/master/build/example.build.js
//
// Typical usage:
// node r.js -o build.js
({
	// Read requirejs.config from the following file, 
	// then override and augment these values in the rest of this build file.
	mainConfigFile: "www/app.js",

	paths: {
		// We are not going to optimise d3 (after all, we're getting it from a CDN!)
		d3: "empty:"
	},

	// Our web app source is in www:
	appDir: "www",

	// We want the optimised build to go here:
    dir: "www-built",

	// We don't want our built directory to contain js files that have been combined into app.js:
	removeCombined: true,

	pragmas: {
		// We want the www-built code to exclude debugging.
		debugInclude: false,
		// We may not want to include the ugly black squares that represent projects:
		projectViewInclude: false
	},

	// When building for deployment, we don't want the stubview, only the real view.
	// Also, we want to exclude hidden files (e.g. the .bla.swp files created by vim).
	// TODO - restore this, somehow, perhaps using a pragma?
	//fileExclusionRegExp: /stubview|^\./,

    modules: [
        {
            "name": "app"
        }
    ],

	// Remove the text.js module (needed for the requirejs-json plugin) from lib in the built dir. : 
	stubModules: ["text"],
	optimizeCss: "standard"
})
