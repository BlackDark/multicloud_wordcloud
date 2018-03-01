

// Default config with avoiding overlaps.
export default class ColaJSForceLayout {
	constructor(graph) {
		this.relatedGraph = graph;
		this._force = cola.d3adaptor()
			.avoidOverlaps(true);
	}

	get layoutObject() {
		return this._force;
	}

	start() {
		this._force.start();
	}

	resume() {
		this._force.resume();
	}

	nodes(nodes) {
		this._force.nodes(nodes);
	}

	links(links) {
		this._force.links(links);
	}

	size(widthHeightArray) {
		this._force.size(widthHeightArray);
	}

	changeLinkDistance(functionOrValue) {
		this._force.linkDistance(functionOrValue);
	}

	tick(tickFunction){
		this._force.on("tick", tickFunction);
	}

	onEnd(onEndFunction) {
		this._force.on("end", onEndFunction);
	}

	static updateLinkDistances(forceLayout) {
		forceLayout.start();
	}

	// Stopped implementation
	generateConstraints() {
		let constraintsArray = [];

		for(let i = 1; i < this._textNodes.length; i++) {
			constraintsArray.push({
				"axis": "x",
				"left": this._endPointsNodes[0].id,
				"right": i + this._endPointsNodes.length,
				"gap": 100,
				"equality": false
			});

			constraintsArray.push({
				"axis": "x",
				"right": this._endPointsNodes[1].id,
				"left": i + this._endPointsNodes.length,
				"gap": 5,
				"equality": false
			});

			/*
			 constraintsArray.push({
			 "axis": "y",
			 "left": this._endPointsNodes[2].id,
			 "right": i + this._endPointsNodes.length,
			 "gap": 100
			 });

			 constraintsArray.push({
			 "axis": "y",
			 "right": this._endPointsNodes[0].id,
			 "left": i + this._endPointsNodes.length,
			 "gap": 100
			 });
			 */
		}

		this._force.constraints(constraintsArray);
	}
}
