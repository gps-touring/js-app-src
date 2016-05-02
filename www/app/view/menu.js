define( ["d3", "presenter/menu"], function(d3, presenter) {
	"use strict";

	var settings;

	// TODO - move all this tab control stuff to a file of its own.
	function showRoutes() {
		console.log("showRoutes");
		d3.select("#pointseq-list").classed({selected: true});
		d3.select("#file-list").classed({selected: false});
	}
	function showFiles() {
		console.log("showFiles");
		d3.select("#pointseq-list").classed({selected: false});
		d3.select("#file-list").classed({selected: true});
	}
	var tabControls = [
	{text: "Routes", contentId: "#pointseq-list", click: showRoutes},
	{text: "Files", contentId: "#file-list", click: showFiles}
	];
	function matchKey(d) { return d.contentId; }
	function selectTab(tabControl) {
		console.log("selectTab");
		d3.selectAll(".tab-content").data(tabControls, matchKey)
			//.classed("selected", function(d) { return d.contentId === tabControl.contentId; })
			.classed("selected", true)
			;
	}
	var priv = {
		init: function() {
			var i, j, selection;
			for (i = 0; i < settings.menus.length; ++i) {
				// The elements created here are based on
				// http://www.w3schools.com/howto/howto_css_dropdown.asp.
				selection = d3.select("#menubar")
				.append("div").classed({dropdown: true})
				.append("button").text(settings.menus[i].text).classed({dropbtn: true})
				.append("div").classed({"dropdown-content": true});
				// Create the individual menu items:
				for (j = 0; j < settings.menus[i].items.length; ++j) {
					selection.append("a").text(settings.menus[i].items[j].text)
					.on("click", settings.menus[i].items[j].click);
				}

			}

			//d3.selectAll(".tab-content").data(tabControls, matchKey)
				//.classed("selected", true)
				//;


			var ul = d3.select("#tabs-control").append("ul").classed("tabrow", true);

			//d3.select("#tabs-control").selectAll("button")
			ul.selectAll("li")
				.data(tabControls, matchKey)
				.enter()
				.append("li")
				.classed({"tab-selector": true})
				.attr("href", "#")
				.text(function(d) {return d.text;})
				//.on("click", function(d) { selectTab(d); })
				//.on("click", selectTab )
				.on("click", function(d) { d.click(); })
				;

		}
	};
	var pub = {
		init: priv.init
	};
	settings = presenter.registerView(pub);
	return pub;
});
