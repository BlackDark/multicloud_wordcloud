import BaseElement from "js/visualization/elements/BaseElement";
import GeneratorUtil from "../util/GeneratorUtil";

export default class EndPointElement extends BaseElement {
	constructor(id) {
		super(id);
	}

	draw(container) {
		super.draw(container);

		container.append("circle")
			.classed("endpoint", true)
			.style("fill", GeneratorUtil.getColorForId(this.id))
			.attr("r", 10);

		container.append("text").text(this.id);
	}

	registerHoverListener(nodeArray) {
		let highlight = [];
		let other = [];

		nodeArray.forEach(node => {
			if (node.mostConnectedDocument === this.id) {
				highlight.push(node);
			} else {
				other.push(node);
			}
		});

		this.nodesToFade = other;
		this.addDefaultMouseListener();
	}

	hover(hovered) {
		this.nodesToFade.forEach(node => node._container.classed("fadeOut", hovered));
	}
}
