define( ["d3", "presenter/list/wptseq"], function(d3, presenter) {
	"use strict";

	var settings;
	function init() {
		d3.select("#wptseq-list").append("table").classed({"wptseq-table": true})
			.append("tbody").classed({"wptseq-tbody": true});
	}
	function matchKey(d) { return d.id; }
	function refresh(seqs) {

		// TODO - make this function update the values for rows that already exist in the table.
		//        Currently, it does only the enter() processing, for missing rows.
		var columns = ["id", "length"];
		var rows = d3.select(".wptseq-tbody").selectAll("tr")
			.data(seqs, matchKey)
			.enter()
			.append("tr")
			.attr("title", function(d) { return d.getSourceName(); });

		rows.on("click", function(d) {
			// D3 passes the datum as first param, i.e. the pointSeq in the model.
			// This means that we have the view talking directly to the model, which
			// is not supposed to happen! Hey ho.
			d.setSelected(true);
		})
		.on("mouseover", function(d) {
			d.setHovered(true);
		})
		.on("mouseout", function(d) {
			d.setHovered(false);
		});

		var cols = rows.selectAll("td")
			.data(function(row) {
				return columns.map(function(c) {
					//console.log(c + row[c]);
					return {column: c, value: row[c]};
				});
			})
			.enter()
			.append("td")
			.html(function(d) { return d.value; })
			;
	}
	function showState(wpt, state) {
		// Here we run a D3 update on the single item of data in the array [wpt]
		var rows = d3.select(".wptseq-tbody").selectAll("tr")
			.data([wpt], matchKey)
			.classed(state)
			;
	}
	var pub = {
		init: init,
		refresh: refresh,
		showState: showState
	};
	settings = presenter.registerView(pub);
	return pub;
});
