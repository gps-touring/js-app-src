define([], function() {
	"use strict";
	var parseStr = function(xmlStr, xmlSpec) {
		var oParser = new DOMParser();
		var oDOM = oParser.parseFromString(xmlStr, "application/xml");
		var rootSpec = null;
		// print the name of the root element or error message
		if (oDOM.documentElement.nodeName == "parsererror") {
			console.log("error while parsing application/xml");
			// TODO error reporting.
		}
		else {
			// Check that the root element is one of those specified in xmlSpec.root
			// (usually there will be just one specified there):
			rootSpec = xmlSpec.root[oDOM.documentElement.nodeName];
			if (!rootSpec) {
				colsole.log("Unexpected root element: " + dDOM.documentElement.nodeName);
			}
			else {
				return parseElement(oDOM.documentElement, xmlSpec, rootSpec);
			}
		}
	};

	var STRING = 1;
	var DATETIME = 2;
	var DECIMAL = 3;
	var GYEAR = 4;
	var ANYURI = 5;
	var INTEGER = 6;
	var NONNEGATIVEINTEGER = 7;
	var textParser = {};
	// TODO - validation, and (maybe) conversion to Number when appropriate.
	//        Proper validation means that parameters need to be passed in, and extension of the xmlSpec object.
	textParser[STRING] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[DATETIME] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[DECIMAL] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[GYEAR] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[ANYURI] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[INTEGER] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	textParser[NONNEGATIVEINTEGER] = function(doc) {
		return doc.firstChild.wholeText.toString();
	};
	var parseElement = function(doc, xmlSpec, elementSpec) {
		var res;
		var attrs = elementSpec.attrs ? parseAttributes(doc, elementSpec.attrs) : null;
		var childElements = xmlSpec[elementSpec.type] ? parseType(doc, xmlSpec, elementSpec.type) : null;
		var text = textParser[elementSpec.type] ? textParser[elementSpec.type](doc) : null;

		// TODO - handle case where text and attrs are both not null e.g.<e a="1">string</e>
		if (text !== null) {
			res = text;
		}
		else if (attrs || childElements) {
			// TODO: Check that attrs and childElements have no names in common.
			// Merge attrs and childElements:
			res = Object.assign(attrs || {}, childElements || {});
		}
		else {
			console.log("No spec found for " + elementSpec.type);
		}
		return res;
	};
	var parseAttributes = function(doc, specAttrs) {
		// returns an object {name: value, ...}, including only those names in the spec.
		var i = 0;
		var attrs = doc.attributes;
		var res = {};
		var name;
		for (i = 0; i < attrs.length; ++i) {
			name = attrs.item(i).name;
			//console.log(name);
			//console.log(attrs.item(i).value);
			if (specAttrs[name]) {
				// This attribute is specified in the xmlSpec, so we'll preserve it:
				res[name] = attrs.item(i).value;
			}
			else {
				console.log("Attribute of element <" + doc.nodeName + "> not found in spec, and so ignored: " + name + "=\"" + attrs.item(i).value + "\"");
			}
		}
		return res;
	}
	var parseType = function(doc, xmlSpec, type) {
		// returns an Object {tagname: thing, ...} including only those tagnames that appear as elements in the typeSpec.
		// where thing is an array if tagname can appear more than once.
		var typeSpec = xmlSpec[type];
		var res = {};
		var children = doc.childNodes;
		var i;
		var tagName, tags;
		for (i = 0; i < children.length; ++i) {
			//console.log(children[i].nodeName);
			//console.log(children[i].nodeValue);
			//console.log(children[i].nodeType);
			switch (children[i].nodeType) {
				case Node.ELEMENT_NODE:
					tagName = children[i].nodeName;
					if (typeSpec[tagName]) {
						if (!res[tagName]) {
							res[tagName] = [];
						}
						res[tagName].push(parseElement(children[i], xmlSpec, typeSpec[tagName]));
					}
					else {
						console.log("Ignoring element not in xmlSpec: " + tagName);
					}
				break;
				case Node.TEXT_NODE:
					// We don't bother to report that we've found whitespace text nodes.
					if (children[i].wholeText.toString().trim().length > 0) {
						console.log("Unexpected TEXT_NODE: " + children[i].nodeValue + ": " + children[i].wholeText.toString());
					}
					break;
				default:
					console.log(children[i].nodeName + " is of type " + children[i].nodeType + " and therefore ignored.");
					break;
			}
		}
		// Convert arrays of values back into single strings, when max number of them is 1:
		tags = Object.keys(res);
		// TODO: Validate min and max number of each tag: typeSpec[tags[i]].min and typeSpec[tags[i]].max
		for (i = 0; i < tags.length; ++i) {
			if (typeSpec[tags[i]].max === 1) {
				res[tags[i]] = res[tags[i]][0];
			}
		}

		return res;
	};
	var pub = {
		parseStr: parseStr,
		STRING: STRING,
		DATETIME: DATETIME,
		DECIMAL: DECIMAL,
		GYEAR: GYEAR,
		ANYURI: ANYURI,
		INTEGER: INTEGER,
		NONNEGATIVEINTEGER: NONNEGATIVEINTEGER
	};
	return pub;
});
