import BaseElement from "js/visualization/elements/BaseElement";
import RectElement from "js/visualization/elements/RectElement";
import WordElement from "js/visualization/elements/WordElement";
import EndPointElement from "js/visualization/elements/EndPointElement";
import NormalLink from "js/visualization/elements/edge/NormalLink";
import StringExt from "js/visualization/util/StringExt";

function parseEndPoints(rawData, width, height) {
	var nodes = [];

	rawData.forEach(function (element) {
		let currentEndpoint = new EndPointElement(element.index);
		let center = {
			"x": width / 2,
			"y": height / 2
		};

		currentEndpoint.name = element.documentName;
		currentEndpoint.x = center.x + element.index;
		currentEndpoint.y = center.y + element.index;
		currentEndpoint.fixed = true;

		nodes.push(currentEndpoint);
	});

	return nodes;
}

function parseTextNodes(rawData, startIndex) {
	let nodes = [];
	let index = startIndex;

	rawData.forEach(element => {
		let sum = element.endPointConnections.reduce(function(pv, cv) {
			return pv + cv.frequency;
		}, 0);
		element.endPointConnections.forEach(connection => connection.distribution = (connection.frequency / sum));

		// Remove connections with a distribution of 0
		let connection = [];

		for (var i = 0; i < element.endPointConnections.length; i++) {
			var obj = element.endPointConnections[i];

			if (obj.distribution !== 0) {
				connection.push(obj);
			}
		}

		let currentTextObject = new WordElement(index);
		currentTextObject.text = element.text;
		currentTextObject.frequency = element.frequency;
		currentTextObject.size = 12;
		currentTextObject.originalSize = currentTextObject.size;
		currentTextObject.endPointConnections = connection;
		currentTextObject.posTags = element.posTags;

		index++;
		nodes.push(currentTextObject);
	});

	return nodes;
}

function mapLinks(rawLinks) {
	var nodes = [];

	rawLinks.forEach(function (element) {
		let currentTextObject = new NormalLink(element.id);
		currentTextObject.source = element.source;
		currentTextObject.target = element.target;
		currentTextObject.strength = element.strength;

		nodes.push(currentTextObject);
	});

	return nodes;
}

function replaceIdsWithReferences(nodes, links) {
	var nodeMap = d3.map(nodes, node => node.id);

	links.forEach(function (link) {
		link.source = nodeMap.get(link.source);
		link.target = nodeMap.get(link.target);

		if (link.source === undefined || link.target === undefined) {
			throw "PARSER ERROR! ID REPLACING NOT FOUND FOUND";
		}
	});

	nodes.forEach(node => {
		if(node.endPointConnections) {
			node.endPointConnections.forEach(connection => {
				connection.endpoint = nodes[connection.documentId];
			});
		}
	});
}

function createLinks(nodes, number) {
	var newLinks = [];
	var index = 0;

	for (var i = number; i < nodes.length; i++) {
		var currentNode = nodes[i];
		currentNode.links = [];

		currentNode.endPointConnections.forEach(function (connection, i) {
			var linkObject = {
				id: index++,
				source: currentNode.id,
				target: connection.documentId,
				strength: connection.distribution
			};

			currentNode.links.push(linkObject);
			newLinks.push(linkObject);
		});
	}

	return newLinks;
}

export default class ResponseParser {

	static parse(resposenData, width, height) {
		var endPoints = parseEndPoints(resposenData.endPoints, width, height);
		let textNodes = [];
		textNodes = textNodes.concat(resposenData.textNodes);
		resposenData.endPoints.forEach(element => textNodes = textNodes.concat(element.textNodes));

		var textObjects = parseTextNodes(textNodes, endPoints.length);
		var links = mapLinks(createLinks(endPoints.concat(textObjects), endPoints.length));

		replaceIdsWithReferences(endPoints.concat(textObjects), links);

		return {
			endPoints: endPoints,
			textObjects: textObjects,
			links: links
		};
	}
}
