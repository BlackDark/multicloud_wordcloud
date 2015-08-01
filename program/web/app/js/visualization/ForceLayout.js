export default class ForceLayout {
	constructor(graph) {
		this.relatedGraph = graph;
		this._force = d3.layout.force();
	}

	start() {
		this._force.start();
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

	changeCharge(functionOrValue) {
		this._force.charge(functionOrValue);
	}

	changeLinkStrength(functionOrValue) {
		this._force.linkStrength(functionOrValue);
	}

	changeGravity(value) {
		this._force.gravity(value);
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
}
