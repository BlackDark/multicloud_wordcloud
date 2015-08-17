export default class DragBehaviour {
	constructor(graph, layout) {
		this._graph = graph;
		this._layout = layout;
		this._initalize();
	}

	get dragBehaviour() {
		return d3.behavior.drag()
			.origin(this._originFunction)
			.on("dragstart", this._dragStartFunction)
			.on("drag", this._dragFunction)
			.on("dragend", this._dragEndFunction);
	}

	changeOriginFunction(newFunction) {
		this._originFunction = newFunction;
	}

	changeDragFunction(newFunction) {
		this._dragFunction = newFunction;
	}

	changeDragStartFunction(newFunction) {
		this._dragStartFunction = newFunction;
	}

	changeDragEndFunction(newFunction) {
		this._dragEndFunction = newFunction;
	}

	static create(graph, forceLayout) {
		return d3.behavior.drag()
			.origin(function (d) {
				return d;
			})
			.on("dragstart", function (d) {
				d3.event.sourceEvent.stopPropagation(); // Prevent panning
				d.fixed = true;
			})
			.on("drag", function (d) {
				d.px += d3.event.dx;
				d.py += d3.event.dy;
				d.x += d3.event.dx;
				d.y += d3.event.dy;
				d._container.attr("transform","translate(" + [d.x, d.y] + ")");
				forceLayout.resume();
			})
			.on("dragend", function (d) {
				//d.unlock();
			});
	}

	_initalize() {
		this._originFunction = function (d) {
			return d;
		};

		this._dragStartFunction = function (d) {
			d3.event.sourceEvent.stopPropagation(); // Prevent panning
			d.fixed = true;
		};

		this._dragFunction = function (d) {
			d.px += d3.event.dx;
			d.py += d3.event.dy;
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			d._container.attr("transform", "translate(" + [d.x, d.y] + ")");
			this._layout.resume();
		}.bind(this);

		this._dragEndFunction = function (d) {

		};
	}

	getMoveNodesBoxWise(nodes) {
		let theNodes = nodes;

		return function (d) {
			let scaleX = d3.event.dx / d.x;
			let scaleY = d3.event.dy / d.y;

			theNodes.forEach(function (node) {
					if (node === d) {
						return;
					}

					node.px += scaleX * node.x;
					node.py += scaleY * node.y;
					node.x += scaleX * node.x;
					node.y += scaleY * node.y;
					node._container.attr("transform", "translate(" + [node.x, node.y] + ")");
				}
			);

			d.px += d3.event.dx;
			d.py += d3.event.dy;
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			d._container.attr("transform", "translate(" + [d.x, d.y] + ")");
			this._layout.resume();
		}.bind(this);
	}
}
