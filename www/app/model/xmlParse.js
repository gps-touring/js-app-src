define([], function() {
	"use strict";
	// Returns array of error messages - empty if error-free.
	var xmlSpecErrors = function(xmlSpec) {
		var keys = Object.keys(xmlSpec);
		var i;
		var xmlType;
		var n;
		var errors = [];
		for (i = 0; i < keys.length; ++i) {
			xmlType = keys[i];
			n = xmlType.elements ? 1 : 0;
			n += xmlType.text ? 1 : 0;
			// type must have either elements or text, but not both.
			if (n > 1) {
				errors.push(xmlType + " must not have both 'elements' and 'text' properties.");
			}
			// TODO - make sure no attrs and elements have same name.
		}
		return errors;
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
	textParser[STRING] = function(text) {
		return text;
	};
	textParser[DATETIME] = function(text) {
		return text;
	};
	textParser[DECIMAL] = function(text) {
		return text;
	};
	textParser[GYEAR] = function(text) {
		return text;
	};
	textParser[ANYURI] = function(text) {
		return text;
	};
	textParser[INTEGER] = function(text) {
		return text;
	};
	textParser[NONNEGATIVEINTEGER] = function(text) {
		return text;
	};
	var parseText = function(text, spec) {
		var type = spec.type || STRING;
		var res = text;	// By default, we just return the text.
		if (textParser[type]) {
			res = textParser[type](text);
		}
		else if (spec.type) {
			res = parseText(text, spec.type);
		}
		else {
			console.log("parseText: unknown text type: " + type);
		}
		if (res != null && spec.validator) {
			console.log("Running validator");
			if (!spec.validator(res)) {
				console.log("Failed validation: " + text);
			}
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
				res[name] = parseText(attrs.item(i).value, specAttrs[name]);
			}
			else {
				console.log("Attribute of element <" + doc.nodeName + "> not found in spec, and so ignored: " + name + "=\"" + attrs.item(i).value + "\"");
			}
		}
		return res;
	};
	var parseType = function(doc, xmlSpec, typeSpec) {
		// returns an Object {tagname: thing, ...} including only those tagnames that appear as elements in the typeSpec.
		// where thing is an array if tagname can appear more than once.
		var children = doc.childNodes;
		var i;
		var tagName, tags;
		var attrs = typeSpec.attrs ? parseAttributes(doc, typeSpec.attrs) : {};
		var elements = {};
		var text = [];

		for (i = 0; i < children.length; ++i) {
			//console.log(children[i].nodeValue);
			//console.log(children[i].nodeType);
			switch (children[i].nodeType) {
				case Node.ELEMENT_NODE:
					tagName = children[i].nodeName;
					if (typeSpec.elements && typeSpec.elements[tagName]) {
						//console.log(children[i].nodeName);
						if (!elements[tagName]) {
							elements[tagName] = [];
						}
						// Recursive calling structure, hence the suppression of elint warning.
						elements[tagName].push(parseElement(children[i], xmlSpec, typeSpec.elements[tagName]));	//eslint-disable-line no-use-before-define
					}
					else {
						console.log("Ignoring element not in xmlSpec: " + tagName);
					}
				break;
				case Node.TEXT_NODE:
					if (textParser[typeSpec.type]) {
						// TODO - if this is ever called, we nee to do somethng with var text.
						console.log("TEXT_NODE: IS THIS EVER CALLED????? !!!!!!!!!!!!!!");
						text.push(parseText(children[i].wholeText.toString(), typeSpec ));
					}
					else if (children[i].wholeText.toString().trim().length > 0) {
						// We don't bother to report that we've found whitespace text nodes.
						console.log("Unexpected TEXT_NODE: " + children[i].nodeValue + ": " + children[i].wholeText.toString());
					}
					break;
				default:
					console.log(children[i].nodeName + " is of type " + children[i].nodeType + " and therefore ignored.");
					break;
			}
		}
		// Convert arrays of values back into single strings, when max number of them is 1:
		tags = Object.keys(elements);
		// TODO: Validate min and max number of each tag: typeSpec[tags[i]].min and typeSpec[tags[i]].max
		for (i = 0; i < tags.length; ++i) {
			if (typeSpec.elements && typeSpec.elements[tags[i]].max === 1) {
				elements[tags[i]] = elements[tags[i]][0];
			}
		}

		// Merge attrs and elements into one object:
		return Object.assign(attrs, elements);
	};
	var parseElement = function(doc, xmlSpec, elementSpec) {
		if (textParser[elementSpec.type]) {
			return parseText(doc.firstChild.wholeText.toString(), elementSpec);
		}
		else if (xmlSpec[elementSpec.type]) {
			return parseType(doc, xmlSpec, xmlSpec[elementSpec.type]);
		}
		else {
			console.log("No spec found for " + elementSpec.type);
		}
		return null;
	};
	var parseStr = function(xmlStr, xmlSpec) {
		var oParser = new DOMParser();
		var oDOM = oParser.parseFromString(xmlStr, "application/xml");
		var rootSpec = null;
		var specErrors = xmlSpecErrors(xmlSpec);
		var i;
		for (i = 0; i < specErrors.length; ++i) {
			console.log("XML spec error: " + specErrors[i]);
		}
		// print the name of the root element or error message
		if (oDOM.documentElement.nodeName === "parsererror") {
			console.log("error while parsing application/xml");
			// TODO error reporting.
		}
		else {
			// Check that the root element is one of those specified in xmlSpec.root
			// (usually there will be just one specified there):
			rootSpec = xmlSpec.root[oDOM.documentElement.nodeName];
			if (!rootSpec) {
				console.log("Unexpected root element: " + oDOM.documentElement.nodeName);
			}
			else {
				return parseElement(oDOM.documentElement, xmlSpec, rootSpec);
			}
		}
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
