import UIHelper from "./shape/UIHelper";

export default class UIDebug {
	constructor(uiViz, containerQuerySelector, graphObject) {
		this._uiViz = uiViz;
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment container");
		this._graphObject = graphObject;

		this.addToLayout();
	}

	addToLayout() {
		this.addControls();
		this.addInfos();
	}

	addInfos() {

	}

	addControls() {
		let that = this;

		let check = UIHelper.getCheckbox("Show original pos", "showOrgPos", undefined, false);
		$(check).find("input").on("change", function() {
			let draw = this.checked;
			that._graphObject.currentGraph._drawOriginalPositionLink.call(that._graphObject.currentGraph, draw);
		});

		this._container.node().appendChild(check);
	}
}
