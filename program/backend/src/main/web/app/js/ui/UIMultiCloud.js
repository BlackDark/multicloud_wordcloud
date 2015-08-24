import UIGeneral from "./global-ui/UIGeneral";
import UIUploading from "./upload/UIUploading";
import UIVisualization from "./visualization/UIVisualization";

export default class UIMultiCloud {
	constructor(visualizationInitializer) {
		this._visualization = visualizationInitializer;

		this._init();
	}

	_init() {
		let uiGeneral = new UIGeneral();
		let uiUploading = new UIUploading();
		//let uiVisualization = new UIVisualization($('#visualizationContainer'));

		uiGeneral.registerUploading(uiUploading);
		uiGeneral.registerVisualizationObject(this._visualization);
	}
}
