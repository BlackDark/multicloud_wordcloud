export default class DebugConfig {
	constructor() {
		this._collisionRemovalTimes = 200;
		this._drawLinksD3Force = false;
		this._drawLinksColaForce = false;
		this._applyBorderConstraints = true;
	}

	get collisionRemovalTimes() {
		return this._collisionRemovalTimes;
	}

	get drawLinksD3Force() {
		return this._drawLinksD3Force;
	}

	get drawLinksColaForce() {
		return this._drawLinksColaForce;
	}

	get applyBorderConstraints() {
		return this._applyBorderConstraints;
	}

	static addD3ButtonHeader() {
		d3.select("#forbutton").append("h2")
			.attr("class", "ui header")
			.text("D3");
	}

	static addButtonForD3(graph, functionForClick, text) {
		d3.select("#forbutton").append("button")
			.attr("class", "ui button")
			.text(text)
			.on("click", functionForClick.bind(graph));
	}

	static addColaButtonHeader() {
		d3.select("#forbutton").append("h2")
			.attr("class", "ui header")
			.text("Cola.js");
	}

	static addButtonForCola(graph, functionForClick, text) {
		d3.select("#forbutton").append("button")
			.attr("class", "ui button")
			.text(text)
			.on("click", functionForClick.bind(graph));
	}
}
