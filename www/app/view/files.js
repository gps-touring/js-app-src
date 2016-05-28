define( ["d3", "presenter/files"], function(d3, presenter) {
	"use strict";

	var settings;
	// Code copied from http://www.html5rocks.com/en/tutorials/file/dndfiles/
	//
	function handleFileSelect(evt) {
		var files = evt.target.files; // FileList object
		// files is a FileList of File objects. List some properties.
		var output = [];
		var i, f;
		for (i = 0; i < files.length; i++) {
			f = files[i];
			var reader = new FileReader();
			reader.onload = priv.onFileReaderLoad(f);
			output.push("<li><strong>", escape(f.name), "</strong> (", f.type || "n/a", ") - ",
					f.size, " bytes, last modified: ",
					f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
					"</li>");
			reader.readAsText(f);
		}
		document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";
	}
	var priv = {
		onFileReaderLoad: function(file) {
			return function(e) {
				var contents = e.target.result;
				//alert(contents);
				presenter.loadGpxFile(file, contents);
			};
		},
		init: function(tabId) {
			d3.select("#" + tabId).append("output").attr("id", "list");

			// Check for the various File API support.
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				// Great success! All the File APIs are supported.
				document.getElementById("files").addEventListener("change", handleFileSelect, false);
			} else {
				alert("The File APIs are not fully supported in this browser.");
			}
		}
	};
	var pub = {
		init: priv.init
	};
	settings = presenter.registerView(pub);
	return pub;
});
