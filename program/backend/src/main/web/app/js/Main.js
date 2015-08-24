import UIMultiCloud from "ui/UIMultiCloud";
import Visualization from "./visualization/VisualzationInitializer";

export default class Main {
	static start() {
		let visualization = new Visualization();
		let ui = new UIMultiCloud(visualization);
	}
}
