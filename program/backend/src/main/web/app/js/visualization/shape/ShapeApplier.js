
import TimingHelper from "js/visualization/util/TimingHelper";
import NodeSorter from "js/visualization/NodeSorter";
import ShapingHelper from "./ShapingHelper";

export default class ShapeApplier {
	constructor(parameters, textNodes, endPointNodes, forceLayout) {
		this._parameters = parameters;
		this._textNodes = textNodes;
		this._endPointNodes = endPointNodes;
		this._drawAllWords = false;
		this._forceLayout = forceLayout;
		this._endFunction = function(){};
	}

	onEnd(call, caller) {
		this._endFunction = function() {
			call.call(caller);
		}.bind(this);
	}

	registerProgressListener(progress) {
		this._progress = progress;
	}

	_reportProgress(progressValue, functionContinue) {
		this._progress.updateProgress(progressValue);
	}

	startShaping(height, width) {
		this._currentShapeObject = new this._parameters.shapeConstructor(height, width, this._endPointNodes);
		this._currentShapeObject.initialize();
		this._forceLayout.resume();

		setTimeout(this._beginShape.bind(this), 1000);
	}

	_beginShape() {
		this._forceLayout.stop();

		let nodeFinder = new NodeSorter(this._textNodes, this._endPointNodes);

		this._processParametersBeforePlacing(this._currentShapeObject, nodeFinder, this._parameters);

		let timing = new TimingHelper("Placing nodes took: ");
		timing.startRecording();
		this._placingNodes(nodeFinder, this._currentShapeObject, this._drawAllWords);
		timing.endRecording();

		// Remove skipped nodes  TODO
		nodeFinder.skippedNodes.forEach(element => element._container.classed("hidden", true));
		console.log("Skipped nodes: " + nodeFinder.skippedNodes.length);

		this._currentShapeObject.storedWords.forEach(function(objectStore) {
			objectStore.element.x = objectStore.x;
			objectStore.element.y = objectStore.y;

			objectStore.element._container.classed("hidden", false);

			objectStore.element._container.transition()
				.duration(750)
				.attr("transform", function (d) {
					return "translate(" + [d.x, d.y] + ")";
				})
		});
		this._processParametersAfterPlacing(this._currentShapeObject, nodeFinder, this._parameters);
		this._endFunction();

	}

	_shiftToPoint(point) {
		let wordArray = [];
		let elementToDistanceDirection = new Map();

		this._currentShapeObject.storedWords.forEach(store => {
			wordArray.push(store.element);
			let dx = point.x - store.element.x;
			let dy = point.y - store.element.y;
			let distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			let direction = [dx, dy];
			elementToDistanceDirection.set(store.element, {"distance": distance, "direction": direction});
		});

		wordArray.sort(function(a, b) {
			return elementToDistanceDirection.get(a).distance - elementToDistanceDirection.get(b).distance;
		});

		wordArray.forEach(function(node) {
			let bufDirection = elementToDistanceDirection.get(node).direction;
			this._currentShapeObject.removePixelsFor(node);
			let moveValues = ShapingHelper.getShiftValuesXY(point, bufDirection, node, this._currentShapeObject);
			node.x += moveValues.x;
			node.y += moveValues.y;
			this._currentShapeObject.setPixelsFor(node);
			node._container.transition()
				.duration(500)
				.attr("transform", function (d) {
					return "translate(" + [d.x, d.y] + ")";
				});
		}.bind(this));
	}

	_shiftMiddle() {
		this._shiftToPoint(this._currentShapeObject._center);
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

	_processDrawAllWordsStep(shapeObject, nodeFinder) {
		this._textNodes.forEach(textNode => textNode.decrementSize());
		shapeObject.resetPlacing();
		nodeFinder.reset();
	}

	_fillShapeSpace(shapeObject, nodeFinder) {
		let availableSpace = shapeObject._width * shapeObject._height;
		let changedSize = false;

		while(availableSpace > getUsedSpace(this._textNodes)) {
			changedSize = true;
			this._textNodes.forEach(textNode => textNode.incrementSize());
		}

		if(changedSize) {
			this._textNodes.forEach(textNode => textNode.decrementSize());
		}

		function getUsedSpace(elements) {
			var space = 0;
			elements.forEach(element => space += element.height * element.width);

			return space;
		}
	}

	_processParametersBeforePlacing(shapeObject, nodeFinder, parameters) {
		if(parameters.fillSpace) {
			this._fillShapeSpace(shapeObject, nodeFinder);
		}

		if(parameters.placeAllWords) {
			this._drawAllWords = true;
		}
	}

	_processParametersAfterPlacing(shapeObject, nodeFinder, parameters) {
		if(parameters.centrateWords) {
			this._shiftMiddle();
		}
	}
}
