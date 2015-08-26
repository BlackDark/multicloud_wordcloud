import UIHelper from "../shape/UIHelper";
import FontParameter from "../../../visualization/configuration/GeneralParameters";
import * as FontScaleEnum from "../../../visualization/configuration/FontScaleEnum";

export default class UIFontManipulation {
	constructor(containerQuerySelector, graphObject) {
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment");
		this._parameter = new FontParameter();
		this._graphObject = graphObject;
		this._selectedScaleFormat = FontScaleEnum.LINEAR;

		this._addToLayout();
	}

	_addToLayout() {
		let that = this;

		this._container.append("h2")
			.attr("class", "ui header")
			.text("General");

		this._itemContainer = this._container.append("div").attr("class", "ui items");

		let inputMin = UIHelper.getInputNumber("Min font-size", "minimiumsize", false, this._parameter.minimalFontSize, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMin);
		$(inputMin).find('input').change(function() {
			that._parameter.minimalFontSize = +this.value;
			that.changeEvent();
		});

		let inputMax = UIHelper.getInputNumber("Max font-size", "maximumsize", false, this._parameter.maximalFontSize, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMax);
		$(inputMax).find('input').change(function() {
			that._parameter.maximalFontSize = +this.value;
			that.changeEvent();
		});

		let inputUse = this._getCheckBox();
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputUse);

		$(inputUse).find('input').change(function() {
			if (!this.checked) {
				that._parameter.scaleFormat = FontScaleEnum.DEFAULT;
			} else {
				that._parameter.scaleFormat = that._selectedScaleFormat;
			}

			that.changeEvent();
		});
	}

	_getCheckBox() {
		let checked = false;

		if(this._parameter.scaleFormat !== FontScaleEnum.DEFAULT) {
			checked = true;
		}

		return UIHelper.getCheckbox("Use font-sizes", "fixedsize", undefined, checked);
	}

	changeEvent() {
		if(this._graphObject.currentGraph === undefined) {
			return;
		}

		this._graphObject.currentGraph.applyFontScaling.call(this._graphObject.currentGraph, this._parameter);
	}
}
