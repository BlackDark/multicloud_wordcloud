import UIHelper from "../shape/UIHelper";
import FontParameter from "../../../visualization/configuration/GeneralParameters";
import * as FontScaleEnum from "../../../visualization/configuration/FontScaleEnum";

var currentUI = undefined;

export default class UIFontManipulation {
	constructor(containerQuerySelector, graphObject) {
		currentUI = this;
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui segment container");
		this._parameter = new FontParameter();
		this._graphObject = graphObject;
		this._selectedScaleFormat = FontScaleEnum.LINEAR;

		this._addToLayout();
	}

	_addToLayout() {
		let that = this;

		this._container.append("h3")
			.attr("class", "ui header")
			.text("Font");

		this._itemContainer = this._container.append("div").attr("class", "ui items");

		let inputMin = UIHelper.getInputNumber("Min font-size", "minimiumsize", false, this._parameter.minimalFontSize, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMin);
		$(inputMin).find('input').change(function() {
			that._parameter.minimalFontSize = +this.value;
			that.changeEvent();
		});
		this._inputMin = inputMin;

		let inputMax = UIHelper.getInputNumber("Max font-size", "maximumsize", false, this._parameter.maximalFontSize, undefined);
		this._itemContainer.append("div").attr("class", "item").node().appendChild(inputMax);
		$(inputMax).find('input').change(function() {
			that._parameter.maximalFontSize = +this.value;
			that.changeEvent();
		});
		this._inputMax = inputMax;

		let button1 = UIHelper.getButton("Linear");
		d3.select(button1).datum({"scaleFormat": FontScaleEnum.LINEAR});
		let button2 = UIHelper.getButton("Quadratic");
		d3.select(button2).datum({"scaleFormat": FontScaleEnum.QUADRATIC});
		let button3 = UIHelper.getButton("Sqrt");
		d3.select(button3).datum({"scaleFormat": FontScaleEnum.SQRT});
		let button4 = UIHelper.getButton("Log");
		d3.select(button4).datum({"scaleFormat": FontScaleEnum.LOG});

		let buttonGroup = this._itemContainer.append("div").attr("class", "item");
		let buttonGrid = this._getButtonGrouping([button1, button2, button3, button4], 2).node();
		buttonGroup.node().appendChild(buttonGrid);

		$(buttonGrid).find("button").click(function() {
			$(buttonGrid).find("button").removeClass("active");
			$(this).addClass("active");
			that._selectedScaleFormat = d3.select(this).datum().scaleFormat;
			that._parameter.scaleFormat = that._selectedScaleFormat;
			that.changeEvent();
		});
	}

	_getButtonGrouping(array, activeIndex) {
		let selectedDiv = d3.select(document.createElement("div"));
		selectedDiv.attr("class", "ui equal width grid container");

		let indexMax = 2;
		let currentIndex = 0;
		let currentRow;
		let index = 0;

		array.forEach(element => {
			if (currentIndex === 0) {
				currentRow = selectedDiv.append("div").attr("class", "equal width row");
			}
			d3.select(element).classed("column", true);
			if(index === activeIndex) {
				d3.select(element).classed("active", true);
			}
			currentRow.node().appendChild(element);
			currentIndex = (currentIndex + 1) % indexMax;
			index++;
		});

		return selectedDiv;
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

	updateFontValues(min, max) {
		$(this._inputMin).find('input').val(min);
		$(this._inputMax).find('input').val(max);
	}

	updateFont() {
		let graphStatistics = this._graphObject.currentGraph.graphStatistics;
		this.updateFontValues(graphStatistics.minFont, graphStatistics.maxFont);
	}

	static refreshFontValues() {
		if (currentUI === undefined) {
			return;
		}

		currentUI.updateFont();
	}
}
