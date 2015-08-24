import UIGeneral from "global-ui/UIGeneral";
import UIUploading from "upload/UIUploading";

export default class UIMultiCloud {
	constructor(visualizationInitializer) {
		this._visualization = visualizationInitializer;

		this._init();
	}

	_init() {
		let uiGeneral = new UIGeneral();
		let uiUploading = new UIUploading();

		uiGeneral.registerUploading(uiUploading);
		uiGeneral.registerVisualizationObject(this._visualization);
	}
}
