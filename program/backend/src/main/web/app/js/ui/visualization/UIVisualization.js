import UIFontManipulation from "./general/UIFontManipulation";
import UIShape from "./shape/UIShapeParameter";
import UIUpload from "./general/UIUploadParameters";

export default class UIVisualization {
	constructor(container, graphObject) {
		this._topContainer = container;
		this._graphObject = graphObject;

		this._generateSelectors();
		this._drawLayout();
	}

	_drawLayout() {
		this.font = new UIFontManipulation(this._controlSelector, this._graphObject);
		this.shape = new UIShape(this._controlSelector, this._graphObject);
		this.upload = new UIUpload(this, this._topControlDiv, this._graphObject);
	}

	_generateSelectors() {
		this._controlSelector = this._topContainer.find('#forbutton');
		this._topControlDiv = this._topContainer.find('#topControlDiv');
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
	}

	updateVisualization(responseData) {
		this._graphObject.cleanVisualization();
		this._graphObject.execute(responseData);
	}
}
