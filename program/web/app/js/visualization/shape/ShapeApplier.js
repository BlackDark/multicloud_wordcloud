
// Utils
import TimingHelper from "js/visualization/util/TimingHelper";

import NodeSorter from "js/visualization/NodeSorter";

export default class ShapeApplier {
	constructor(parameters, textNodes, endPointNodes) {
		this._parameters = parameters;
		this._textNodes = textNodes;
		this._endPointNodes = endPointNodes;
		this._drawAllWords = false;
	}

	registerProgressListener(progress) {
		this._progress = progress;
	}

	_reportProgress(progressValue, functionContinue) {
		this._progress.updateProgress(progressValue);
	}

	startShaping(height, width) {
		let shapeObject = new this._parameters.shapeConstructor(height, width, this._endPointNodes);
		shapeObject.initialize();
		let nodeFinder = new NodeSorter(this._textNodes, this._endPointNodes);

		this._processShapeParameters(shapeObject, nodeFinder, this._parameters);

		let timing = new TimingHelper("Placing nodes took: ");
		timing.startRecording();
		this._placingNodes(nodeFinder, shapeObject, this._drawAllWords);
		timing.endRecording();

		// Remove skipped nodes  TODO
		nodeFinder.skippedNodes.forEach(element => element._container.remove());
		console.log("Skipped nodes: " + nodeFinder.skippedNodes.length);

		shapeObject.storedWords.forEach(function(objectStore) {
			objectStore.element.x = objectStore.x;
			objectStore.element.y = objectStore.y;

			objectStore.element._container.transition()
				.duration(750)
				.attr("transform", function (d) {
					return "translate(" + [d.x, d.y] + ")";
				})
		});
	}

	_placingNodes(nodeFinder, shapeObject, drawAllWords) {
		while (nodeFinder.hasNodes()) {
			//this._reportProgress(nodeFinder.processValue * 100);
			let nodeAndEndPoint = nodeFinder.getNextNodeAndEndPoint();

			if (shapeObject.placeNearEndPoints(nodeAndEndPoint.endPoint, nodeAndEndPoint.node)) {
				nodeFinder.placeNode(nodeAndEndPoint.node);
			} else {
				if(drawAllWords) {
					this._processDrawAllWordsStep(shapeObject, nodeFinder);
				} else {
					nodeFinder.skipNode(nodeAndEndPoint.node);
				}
			}
		}
	}

	_processShapeParameters(shapeObject, nodeFinder, parameters) {
		if(parameters.fillSpace) {
			this._fillShapeSpace(shapeObject, nodeFinder);
		}

		if(parameters.placeAllWords) {
			this._drawAllWords = true;
		}
	}

	_processDrawAllWordsStep(shapeObject, nodeFinder) {
		this._textNodes.forEach(textNode => textNode.decrementSize());
		shapeObject.resetPlacing();
		nodeFinder.reset();
	}

	_fillShapeSpace(shapeObject, nodeFinder) {
		let availableSpace = shapeObject._width * shapeObject._height;

		while(availableSpace > getUsedSpace(this._textNodes)) {
			this._textNodes.forEach(textNode => textNode.incrementSize());
		}

		this._textNodes.forEach(textNode => textNode.decrementSize());

		function getUsedSpace(elements) {
			var space = 0;
			elements.forEach(element => space += element.height * element.width);

			return space;
		}
	}
}
