export default class BaseElement {
	constructor(id) {
		this.id = id;
		this._container = undefined;
	}

	draw(container) {
		this._container = container;
	}
}
