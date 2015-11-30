import BaseElement from "js/visualization/elements/BaseElement";
import GeneratorUtil from "../util/GeneratorUtil";

export default class EndPointElement extends BaseElement {
	constructor(id) {
		super(id);
		this.selected = false;
	}

	draw(container) {
		let that = this;
		let HTMLabsoluteTip = d3.select(".endpoint-tooltip");

		super.draw(container);

		let circle = container.append("circle")
			.classed("endpoint", true)
			.style("fill", GeneratorUtil.getColorForId(this.id))
			.attr("r", 10);

		circle.on("mouseover", function () {
			HTMLabsoluteTip.style("opacity", "1");

			HTMLabsoluteTip.text(that.name);

			var matrix = this.getScreenCTM()
					.translate(+this.getAttribute("cx"),
							+this.getAttribute("cy"));
			HTMLabsoluteTip
					.style("left",
							(window.pageXOffset + matrix.e) + "px")
					.style("top",
							(window.pageYOffset + matrix.f + 30) + "px");

		}).on("mouseout", function () {
			return HTMLabsoluteTip.style("opacity", "0");
		});
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

	registerOnClick(callback, caller) {
		this.addMouseListener(BaseElement.onClick, this.onClick.bind(this, callback, caller));
	}

	onClick(callback, caller) {
		this.selected = !this.selected;
		this._container.classed("selected", this.selected);
		callback.call(caller);
	}

	deselect() {
		this.selected = false;
		this._container.classed("selected", this.selected);
	}
}
