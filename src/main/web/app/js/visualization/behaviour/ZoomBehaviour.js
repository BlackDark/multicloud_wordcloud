export default class ZoomBehaviour {
	constructor(graph) {
		this._graph = graph;
		this._zoom = d3.behavior.zoom()
			.duration(150)
			.scaleExtent([0.1, 4])
			.on("zoom", () => zoomed(this._graph));
	}

	getZoomObject() {
		return this._zoom;
	}

	reset() {
		this._zoom.translate([0, 0])
			.scale(1);
		this._zoom.event(this._graph._container);
	}
}

function zoomed(graph) {
	graph._container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function resetZoom(graph) {
	graph._container.attr("transform", "translate(" + 0 + ")scale(" + 0 + ")");
}
