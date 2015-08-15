

export default class UIProgress {
	constructor(container) {
		this._container = container;

		this._addToLayout();
	}

	updateProgress(number) {
		this._progressDiv.attr("data-percent", number);
		this._barDiv.style("width", number + "%");
	}

	_addToLayout() {
		this._progressDiv = this._container.append("div");
		this._progressDiv.attr("class", "ui green progress");
		this._progressDiv.attr("data-percent", 0);

		this._barDiv = this._progressDiv.append("div")
		.attr("class", "bar")
		.style("width", "0%");
	}

	removeProgress() {

	}
}
