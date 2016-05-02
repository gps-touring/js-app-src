define( ["d3", "presenter/tabs", "view/files", "view/list/pointseq"], function(d3, presenter, filesView, routesView) {
	"use strict";

	var settings;

	var tabControls = [
		{view: routesView, text: "Routes", contentId: "pointseq-list", selected: true},
		{view: filesView, text: "Files", contentId: "file-list"}
	];
	function matchKey(d) { return d.contentId; }
	function selectTab(tabControl) {
		console.log("selectTab");
		d3.select("#tabs-control").select("ul").selectAll("li")
			.data(tabControls, matchKey)
			.classed("selected", function(d) { return matchKey(d) === matchKey(tabControl); })
			;
		d3.select("#tabs-content").selectAll("div")
			.data(tabControls, matchKey)
			.classed("selected", function(d) { return matchKey(d) === matchKey(tabControl); })
			;
	}
	var priv = {
		init: function() {
			// Set up the tab controllers (the tabs you click on)
			var ul = d3.select("#tabs-control").append("ul").classed("tabrow", true);

			ul.selectAll("li")
				.data(tabControls, matchKey)
				.enter()
				.append("li")
				.classed({"tab-selector": true, selected: function(d) { return d.selected; }})
				.attr("href", "#")
				.text(function(d) { return d.text; })
				.on("click", selectTab )
				;

			// Set up the content of each tab.
			d3.select("#tabs-content").selectAll("div")
				.data(tabControls, matchKey)
				.enter()
				.append("div")
				.attr("id", function(d) { return d.contentId; })
				.classed({"tab-content": true, selected: function(d) { return d.selected; }})
				;

			// Initialise the view (content) for each tab:
			tabControls.forEach(function(e) {
				e.view.init();
			});
		}
	};
	var pub = {
		init: priv.init
	};
	settings = presenter.registerView(pub);
	return pub;
});

