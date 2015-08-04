export default class DragBehaviour {
	static create(graph) {
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
			})
			.on("dragend", function (d) {
				//d.unlock();
			});
	}
}
