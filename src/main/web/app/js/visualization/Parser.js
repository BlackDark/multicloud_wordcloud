import BaseElement from "js/visualization/elements/BaseElement";
import RectElement from "js/visualization/elements/RectElement";
import WordElement from "js/visualization/elements/WordElement";
import EndPointElement from "js/visualization/elements/EndPointElement";
import NormalLink from "js/visualization/elements/edge/NormalLink";

function mapEndPoints(rawEndPoints) {
	var nodes = [];

	rawEndPoints.forEach(function (element) {
		let currentEndpoint = new EndPointElement(element.id);
		currentEndpoint.x = element.x;
		currentEndpoint.y = element.y;
		currentEndpoint.fixed = element.fixed;

		nodes.push(currentEndpoint);
	});

	return nodes;
}

function mapTextObjects(rawTextObjects) {
	var nodes = [];

	rawTextObjects.forEach(function (element) {
		let currentTextObject = new WordElement(element.id);
		currentTextObject.text = element.text;
		currentTextObject.size = element.size;
		currentTextObject.width = element.width;
		currentTextObject.height = element.height;
		currentTextObject.endPointConnections = element.endPointConnections;

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
	});
}

export default class Parser {
	static parse(data) {
		var endPoints = mapEndPoints(data.endpoints || []);
		var textObjects = mapTextObjects(data.textObjects || []);
		var links = mapLinks(data.links || []);

		replaceIdsWithReferences(endPoints.concat(textObjects), links);

		return {
			endPoints: endPoints,
			textObjects: textObjects,
			links: links
		};
	}
}
