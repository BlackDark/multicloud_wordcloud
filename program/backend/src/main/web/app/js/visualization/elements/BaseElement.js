export default class BaseElement {
	constructor(id) {
		this.id = id;
		this._container = undefined;
	}

	draw(container) {
		this._container = container;
		this.addDefaultMouseListener();
	}

	addMouseListener(type, method) {
		this._container.on(type, method.bind(this));
	}

	removeMouseListener(type) {
		this._container.on(type, null);
	}

	addDefaultMouseListener() {
		//this.addMouseListener(BaseElement.onMouseDownType, this.onMouseDown);
		this.addMouseListener(BaseElement.onMouseOverType, this.onMouseOver);
		this.addMouseListener(BaseElement.onMouseOutType, this.onMouseOut);
	}

	onMouseOver() {
		this.hover(true);
	}

	onMouseOut() {
		this.hover(false);
	}

	onMouseUp() {
		this.removeMouseListener(BaseElement.onMouseMove);
		this.removeMouseListener(BaseElement.onMouseUp);
	}

	onMouseDown() {
		this.addMouseListener(BaseElement.onMouseUpType, this.onMouseUp);
		this.addMouseListener(BaseElement.onMouseMoveType, this.onMouseMove);
		d3.event.preventDefault();
	}

	// Not working
	onMouseMove() {
		var pos = d3.mouse(this._container.node());
		this._container.attr("transform", "translate(" + [this.x, this.y] + ")");
	}

	static get onMouseDownType() {
		return "mousedown";
	}

	static get onMouseUpType() {
		return "mouseup";
	}

	static get onMouseMoveType() {
		return "mousemove";
	}

	static get onMouseOverType() {
		return "mouseover";
	}

	static get onMouseOutType() {
		return "mouseout";
	}

	hover (hovering) {
		// Implement in subclasses!
	}

	static addToolTip(elementSelection, tooltip) {
		if (tooltip) {
			elementSelection.append("title").text(tooltip);
		}
	}
}
