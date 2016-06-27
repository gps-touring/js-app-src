define( ["d3"], function(d3) {
	"use strict";

	function Table(opts) {
		Object.defineProperties(this, {
			tbody: { value: d3.select("#" + opts.parentId).append("table").append("tbody") },
			matchKey: { value: opts.matchKey },
			columns: { value: opts.columns }
		});
	}
	Table.prototype.refresh = function(seqs) {
		//console.log(seqs);

		// TODO - make this function update the values for rows that already exist in the table.
		//        Example: http://bl.ocks.org/LeeMendelowitz/11383724
		//        Currently, it does only the enter() processing, for missing rows,
		//        and the exit() processing to remove rows that are in the table, but not in the data.
		var rows = this.tbody.selectAll("tr")
			.data(seqs, this.matchKey);
		rows.enter()
			.append("tr")
			.attr("title", function(d) { return d.title; });

		rows.on("click", function(d) {
			// D3 passes the datum as first param, i.e. the pointSeq provided by the presenter.
			// This gives us access to the model's PointSeq via the modelObject property.
			// This means that we have the view talking directly to the model, which
			// is not supposed to happen! Hey ho.
			d.modelObject.setSelected(true);
		})
		.on("mouseover", function(d) {
			d.modelObject.setHovered(true);
		})
		.on("mouseout", function(d) {
			d.modelObject.setHovered(false);
		});

		// Populate the columns of each row:
		var columns = this.columns;
		var tds = rows.selectAll("td")
			.data(function(row) {
				return columns.map(function(c) {
					//console.log(c + row[c]);
					return {column: c, value: row[c]};
				});
			})
			.enter()
			.append("td")
			.classed("pointseq-cell", true);

		tds.html(function(d) { return d.value; })
			;
		// Remove rows that are in the table, but not in the data:
		rows.exit().remove();
	}
	Table.prototype.showState = function(wpt, state) {
		// Here we run a D3 update on the single item of data in the array [wpt]
		this.tbody.selectAll("tr")
			.data([wpt], this.matchKey)
			.classed(state)
			;
	}

	var pub = {
		Table: Table
	};
	return pub;
});
