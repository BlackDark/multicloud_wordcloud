import UIGeneral from "./global-ui/UIGeneral";
import UIUploading from "./upload/UIUploading";
import Visualization from "./visualization/VisualzationInitializer";

export default class Main {
	static start() {
		let uiGeneral = new UIGeneral();
		let uiUploading = new UIUploading();
		let visualization = new Visualization();

		uiGeneral.registerUploading(uiUploading);
		uiGeneral.registerVisualizationObject(visualization);
	}
}
