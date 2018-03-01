import UIFontManipulation from "./general/UIFontManipulation";
import UIShape from "./shape/UIShapeParameter";
import UIUpload from "./general/UIUploadParameters";
import UIDebug from "./UIDebug";
import UIFilter from "./UIFilter";
import UIHelper from "./shape/UIHelper";

export default class UIVisualization {
	constructor(container, graphObject) {
		this._topContainer = container;
		this._graphObject = graphObject;

		this._generateSelectors();
		this._drawLayout();
		this._activation();
	}

	_drawLayout() {
		let that = this;

		this._addInteractionControls();

		this.font = new UIFontManipulation(UIHelper.appendGridColumnWithClass(this._graphManipulationItems, undefined), this._graphObject);
		this.shape = new UIShape(UIHelper.appendGridColumnWithClass(this._graphManipulationItems, undefined), this._graphObject);
		this.upload = new UIUpload(this, $(UIHelper.getNewAccordionContentDiv(this._topAccordion[0], "Document Configuration")), this._graphObject);
		this.debug = new  UIDebug(this, $(UIHelper.getNewAccordionContentDiv(this._topAccordion[0], "Debug information")), this._graphObject);
		this.filter = new UIFilter(this, $(UIHelper.getNewAccordionContentDiv(this._topAccordion[0], "Filter")), this._graphObject);
	}

	_addInteractionControls() {
		let that = this;

		let searchCheckbox = UIHelper.getCheckbox("Activate search mode", "search_mode", undefined, false);
		var queriedCheckbox = $(searchCheckbox);

		queriedCheckbox.find("input").on("change", function() {
			that._graphObject.currentGraph.toggleSearchMode(this.checked);
		});

		this._alwaysVisible.append(searchCheckbox);

		let selectionButton = UIHelper.getButton("Select all nodes");
		let queriedButton = $(selectionButton);
		queriedButton.addClass("basic");

		let deselectButton = UIHelper.getButton("Deselct all nodes");
		$(deselectButton).addClass("basic");
		$(deselectButton).click(function() {
			that._graphObject.currentGraph.deselectAllEndNodes.call(that._graphObject.currentGraph);
		});

		let container = $(document.createElement("div"));
		container.addClass("ui").addClass("container").addClass("interaction-selection");
		container.append(selectionButton);
		container.append(deselectButton);

		this._alwaysVisible.append(container);

		queriedButton.click(function() {
			that._graphObject.currentGraph.selectAllEndNodes.call(that._graphObject.currentGraph);
		});
	}

	_activation() {
		this._topControlDiv.accordion();
	}

	_generateSelectors() {
		this._alwaysVisible = this._topContainer.find('#alwaysVisibleControls');
		this._topControlDiv = this._topContainer.find('#topControlDiv');
		this._topAccordion = this._topControlDiv.find('.accordion');
		this._graphManipulationDiv = $(UIHelper.getNewAccordionContentDiv(this._topAccordion[0], "Graph Manipulation"));
		this._graphManipulationItems = $(d3.select(this._graphManipulationDiv[0]).append("div").attr("class", "ui stackable two columns grid container").node());
	}

	resize() {
		let width = this._topContainer.find('#graph').width();
		let height = this._topContainer.find('#graph').height();

		this._graphObject.resize(width, height);
	}

	showVisualization(responseDate, id) {
		if(responseDate === undefined) {
			return;
		}

		if(responseDate.textNodes.length === 0) {
			$('#visualizationEmpty').removeClass('hidden');
			$('#visualizationNotReady').addClass('hidden');
			$('#graph').addClass('hidden');

			return;
		}

		$('#visualizationNotReady').addClass('hidden');
		$('#visualizationEmpty').addClass('hidden');
		$('#graph').removeClass('hidden');

		this._graphObject.currentId = id;

		this.updateDocumentInformation(responseDate);
		this.updateVisualization(responseDate);
	}

	updateDocumentInformation(responseData) {
		this.upload.updateNumWords(responseData.information.requestedNumWords);
		this.upload.updateTotalNumWords(responseData.information.totalNumWords);
	}

	updateVisualization(responseData) {
		this._graphObject.cleanVisualization();
		this._graphObject.execute(responseData);
		this.font.changeEvent();
		let graphStatistics = this._graphObject.currentGraph.graphStatistics;
		this.font.updateFontValues.call(this.font, graphStatistics.minFont, graphStatistics.maxFont);
	}
}
