define(
	[],
	function() {
		"use strict";

		var priv = {
			onFileReaderLoad: function(e) {
				var contents = e.target.result;
				alert(contents);

				// Experimenting with using DOMParser to parse XML.
				// Investigate https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker
				//
				// TODO - investigate gpx-parse: http://www.vapidspace.com/gpx-parse/doc/index.html
				var oParser = new DOMParser();
				var oDOM = oParser.parseFromString(contents, "text/xml");
				// print the name of the root element or error message
				if (oDOM.documentElement.nodeName == "parsererror") {
				   console.log("error while parsing tex/xml");
				}
				else {
					console.log(oDOM.documentElement.nodeName);
					var x = oDOM.documentElement.childNodes;
					var i = 0;
					for (i = 0; i < x.length ;i++) {
						console.log(x[i].nodeName);
						//txt += x[i].nodeName + ": " + x[i].childNodes[0].nodeValue + "<br>";
					}
				}
			},
			init: function() {
				// Code copied from http://www.html5rocks.com/en/tutorials/file/dndfiles/
				//
				// Check for the various File API support.
				if (window.File && window.FileReader && window.FileList && window.Blob) {
					// Great success! All the File APIs are supported.
					function handleFileSelect(evt) {
						var files = evt.target.files; // FileList object
						// files is a FileList of File objects. List some properties.
						var output = [];
						for (var i = 0, f; f = files[i]; i++) {
							var reader = new FileReader();
							reader.onload = priv.onFileReaderLoad;
							output.push("<li><strong>", escape(f.name), "</strong> (", f.type || "n/a", ") - ",
										f.size, " bytes, last modified: ",
										f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
										"</li>");
							reader.readAsText(f);
						}
						document.getElementById("list").innerHTML = "<ul>" + output.join("") + "</ul>";
					}
					document.getElementById("files").addEventListener("change", handleFileSelect, false);
				} else {
					alert("The File APIs are not fully supported in this browser.");
				}
			}
		};
		var pub = {
			init: priv.init
		};
		return pub;
	});
