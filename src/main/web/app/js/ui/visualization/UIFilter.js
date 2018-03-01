import UIHelper from "./shape/UIHelper";

export default class UIFilter {
	constructor(uiViz, containerQuerySelector, graphObject) {
		this._uiViz = uiViz;
		this._topContainer = containerQuerySelector;
		this._topContainerD3Selector = d3.select(this._topContainer[0]);
		this._container = this._topContainerD3Selector.append("div").attr("class", "ui container");
		this._graphObject = graphObject;
		this.selectedFilters = ["NN", "PR", "VB", "JJ", "X"];

		this.addToLayout();
	}

	addToLayout() {
		this.addControls();
	}

	addControls() {
		let that = this;
		let checkBoxArea = this._container;

		this.configParameters = [];

		let checkNoun = UIHelper.getCheckbox("Noun", "checkNoun", undefined, true);
		this.configParameters.push({
			"domInput": d3.select(checkNoun).select("input").node()
		});

		let checkVerb = UIHelper.getCheckbox("Verb", "checkVerb", undefined, true);
		this.configParameters.push({
			"domInput": d3.select(checkVerb).select("input").node()
		});

		let checkAdj = UIHelper.getCheckbox("Adjectives", "checkAdj", undefined, true);
		this.configParameters.push({
			"domInput": d3.select(checkAdj).select("input").node()
		});

		let checkOther = UIHelper.getCheckbox("Others", "checkOther", undefined, true);
		this.configParameters.push({
			"domInput": d3.select(checkAdj).select("input").node()
		});

		checkBoxArea.node().appendChild(checkNoun);
		checkBoxArea.node().appendChild(checkVerb);
		checkBoxArea.node().appendChild(checkAdj);
		checkBoxArea.node().appendChild(checkOther);

		$(checkNoun).find("input").on("change", function() {
			if (this.checked) {
				that.selectedFilters.push("NN");
				that.selectedFilters.push("PR");
			} else {
				let index = that.selectedFilters.indexOf("NN");
				if (index !== -1) {
					that.selectedFilters.splice(index, index + 1);
				}

				index = that.selectedFilters.indexOf("PR");
				if (index !== -1) {
					that.selectedFilters.splice(index, index + 1);
				}
			}

			that.updateFilter.call(that);
		});

		$(checkVerb).find("input").on("change", function() {
			if (this.checked) {
				that.selectedFilters.push("VB");
			} else {
				let index = that.selectedFilters.indexOf("VB");
				if (index !== -1) {
					that.selectedFilters.splice(index, index + 1);
				}
			}

			that.updateFilter.call(that);
		});

		$(checkAdj).find("input").on("change", function() {
			if (this.checked) {
				that.selectedFilters.push("JJ");
			} else {
				let index = that.selectedFilters.indexOf("JJ");
				if (index !== -1) {
					that.selectedFilters.splice(index, index + 1);
				}
			}

			that.updateFilter.call(that);
		});

		$(checkOther).find("input").on("change", function() {
			if (this.checked) {
				that.selectedFilters.push("X");
			} else {
				let index = that.selectedFilters.indexOf("X");
				if (index !== -1) {
					that.selectedFilters.splice(index, index + 1);
				}
			}

			that.updateFilter.call(that);
		});
	}

	updateFilter() {
		this._graphObject.currentGraph.filtering.call(this._graphObject.currentGraph, this.selectedFilters);
	}
}
