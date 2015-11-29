import ForceLayout from "js/visualization/layouts/D3ForceLayout";
import ColaLayout from "js/visualization/layouts/ColaJSForceLayout";

import SampleDataGenerator from "js/visualization/util/SampleDataGenerator";
import CollisionModule from "js/visualization/CollisionModule";
import DebugConfig from "js/visualization/DebugConfig";
import DragBehaviour from "js/visualization/DragBehaviour";
import ZoomBehaviour from "./behaviour/ZoomBehaviour";

// Utils
import TimingHelper from "js/visualization/util/TimingHelper";

// Shapes
import ShapeApplier from "js/visualization/shape/ShapeApplier";

import FontScaler from "./font/FontScaler";
import GraphStats from "./statistics/GraphStatistics";

export default class Graph {
	constructor(containerSelector) {
		this.config = new DebugConfig();
		this._svg = d3.select(containerSelector).append("svg").classed("graph", true).attr("id", "svgGraph");
		this._container = this._svg.append("g");
		this._defContainer = this._container.append("defs");
		this._linkContainer = this._container.append("g");
		this._originalPositionLinkContainer = this._container.append("g");
		this._nodeContainer = this._container.append("g");
		this._endPointContainer = this._container.append("g");

		this._force = new ForceLayout(this);
		this._graphStatistics = new GraphStats(this);
		this._zoom = new ZoomBehaviour(this);

		let that = this;

		$(document).keyup(function(e){
			if (e.keyCode==27) {
				that._endPointsNodes.forEach(node => node.deselect.call(node));
				that.updateSelectedDocuments();
			}
		});
	}

	get graphStatistics() {
		return this._graphStatistics;
	}

	start() {
		this._redrawGraph();
		this._drawElements();
		this._configureGraph();
		this._updateStats();
		this._force.start();
	}

	data(endPointsNodes, textNodes, links) {
		this._endPointsNodes = endPointsNodes;
		this._textNodes = textNodes;
		this._allTextNodes = textNodes;
		this._links = links;
		this._force.nodes(endPointsNodes.concat(textNodes));
		this._force.links(links);
	}

	resize(width, height) {
		this._width = width;
		this._height = height;
		this._force.size([width, height]);
	}

	_redrawGraph() {
		this._svg.call(this._zoom.getZoomObject());
	}

	_drawElements() {
		let that = this;
		this._nodeElements = this._nodeContainer.selectAll(".node")
			.data(this._textNodes, d => d.id);
		this._nodeElements.exit().remove();
		this._nodeElements.enter().append("g").classed("node", true)
			.each(function (node) {
				node.draw(d3.select(this));
			});

		this._linkElements = this._linkContainer.selectAll(".link")
			.data(this._links, d => d.id);

		this._linkElements.exit().remove();
		this._linkElements.enter().append("g").classed("link", true)
			.each(function (link) {
				return link.draw(d3.select(this));
			});

		this._endPointElements = this._endPointContainer.selectAll(".endpoint")
			.data(this._endPointsNodes, d => d.id);
		this._endPointElements.exit().remove();

		this._endPointElements.enter().append("g").classed("endpoint", true)
			.each(function (node) {
				node.draw(d3.select(this));
				node._container.attr("transform", "translate(" + [node.x, node.y] + ")");
				node.registerHoverListener.call(node, that._textNodes);
				node.registerOnClick.call(node, that.updateSelectedDocuments, that);
			});
	}

	_refreshNodes() {
		let that = this;
		let newTextNodes = [];

		this._allTextNodes.forEach(node => {
			if (!node._container.classed("filtered")) {
				newTextNodes.push(node);
			}
		});

		//this._force.nodes(that._endPointsNodes.concat(newTextNodes));
		this._textNodes = newTextNodes;
		this._force.resume();
	}

	updateSelectedDocuments() {
		let selectedNodes = [];
		let selectedDocumentIds = [];

		this._endPointsNodes.forEach(node => {
			if (node.selected) {
				selectedNodes.push(node);
				selectedDocumentIds.push(node.id);
			}
		});

		for(let i = 0; i < this._textNodes.length; i++) {
			this._textNodes[i]._container.classed("unselected", false);
		}

		if (selectedNodes.length !== 0) {
			this._textNodes.forEach(node => {
				let numMatches = 0;

				for (let i = 0; i < node.endPointConnections.length; i++) {
					if (selectedDocumentIds.indexOf(node.endPointConnections[i].documentId) !== -1) {
						numMatches++;
					}
				}

				if (selectedDocumentIds.length > numMatches ) {
					node._container.classed("unselected", true);
				}
			});
		}
	}

	_configureGraph() {
		this._force.tick(tickForD3Force.call(this, this._linkElements, this._nodeElements));
		this._force.changeLinkStrength(linkstrengthForD3Force());
		this._force.changeCharge(chargeForD3Force());
		this._force.onEnd(this._d3EndFunction.bind(this));

		// Add drag behaviour to end nodes
		//this._activateEndNodeDrag();
		//this._endPointsNodes.forEach( node => node.addDefaultMouseListener());

		let min = undefined;
		let max = undefined;

		this._textNodes.forEach(node => {
			if (min === undefined || min > node.frequency) {
				min = node.frequency;
			}

			if (max === undefined || max < node.frequency) {
				max = node.frequency;
			}
		});

		this._fontScaler = new FontScaler(this._textNodes, min, max);
	}

	_activateEndNodeDrag() {
		this._endPointElements.call(function () {
			let dragging = new DragBehaviour(this, this._force);
			return dragging.dragBehaviour
		}.bind(this)());
	}

	_d3EndFunction() {
		//this._overlapRemoval();
		//this._moveToTopLeftCorner();
		//this._drawOriginalPositionLink();
		//this._markOverlapping();
		//this._applyColaJSLayout();
	}

	applyFontScaling(parameterObject) {
		this._fontScaler.changeScaling.call(this._fontScaler, parameterObject);
	}

	_drawOriginalPositionLink(boolDraw) {
		if (!boolDraw) {
			this._originalPositionLinkContainer.selectAll("*").remove();
			return;
		}

		for (var i = 0; i < this._textNodes.length; i++) {
			var currentNode = this._textNodes[i];

			if (currentNode.isHidden() || currentNode.orgPosX === undefined || currentNode.orgPosY === undefined) {
				continue;
			}

			this._originalPositionLinkContainer.append("g")
				.datum(currentNode)
				.classed("link", true)
				.append("line")
				.attr("class", "originalPosition")
				.attr("x1", function (d) {
					return d.x;
				})
				.attr("y1", function (d) {
					return d.y;
				})
				.attr("x2", function (d) {
					return d.orgPosX;
				})
				.attr("y2", function (d) {
					return d.orgPosY;
				});
		}
	}

	// Applying a shape to the wordcloud.
	_applyLayout(uiShapeParameterObject, endCallBack) {
		this._force.stop();
		this._zoom.reset();

		let layoutApplier = new ShapeApplier(uiShapeParameterObject.parameterObject, this._textNodes, this._endPointsNodes, this._force);
		this._currentLayout = layoutApplier;
		//layoutApplier.registerProgressListener(new UIProgress(d3.select("#forbutton")));
		layoutApplier.startShaping(this._height, this._width);
		layoutApplier.onEnd(function () {
			this._endPointsNodes.forEach(function (node) {
				node._container.transition()
					.duration(750)
					.attr("transform", function (d) {
						return "translate(" + [d.px, d.py] + ")";
					})
			});
			endCallBack();
		}, this);
	}

	_testCentration() {
		this._currentLayout._shiftMiddle();
	}

	_updateStats() {
		this._graphStatistics.updateStats.call(this._graphStatistics);
	}

	filtering(filterList) {
		if (filterList.length === 0) {
			this._allTextNodes.forEach(node => node._container.classed("filtered", true));
		} else if (filterList.length === 5) {
			this._allTextNodes.forEach(node => node._container.classed("filtered", false));
		} else {
			this._allTextNodes.forEach(node => {
				for (let i = 0; i < node.posTags.length; i++) {
					for (var j = 0; j < filterList.length; j++) {
						var obj = filterList[j];
						if (node.posTags[0].indexOf(obj) !== -1) {
							node._container.classed("filtered", false);
							return;
						}
					}
				}
				node._container.classed("filtered", true);
			});
		}

		this._refreshNodes();
		this._updateStats();
	}

	toggleSearchMode(activated) {
		for (var i = 0; i < this._textNodes.length; i++) {
			var obj = this._textNodes[i];
			obj._container.classed("search-mode", activated);
		}
	}

	selectAllEndNodes() {
		for (var i = 0; i < this._endPointsNodes.length; i++) {
			var obj = this._endPointsNodes[i];
			obj.selected = true;
		}
		this.updateSelectedDocuments();
	}
}

function boundsSortedNodes(nodesToSort) {
	var unsortedArray = [].concat(nodesToSort);

	// Sorting x,y pref of x => a.x - b.x || a.y - b.y

	unsortedArray.sort(function (a, b) {
		return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2)) - Math.sqrt(Math.pow(b.x, 2) + Math.pow(b.y, 2));
	});

	return unsortedArray;
}

function tickForD3Force(link, node) {
	return function () {
		if (this.config.drawLinksD3Force) {
			link.selectAll("path").attr("d", function (link) {
				return linkPathFunction([link.source, link.target]);
			});
		}

		node.attr("transform", function (d) {
			return "translate(" + [d.x, d.y] + ")";
		});
	}.bind(this);
}

function linkPathFunction(arrayOfNodes) {

	let lineFunction = d3.svg.line()
		.x(function (d) {
			return d.x;
		})
		.y(function (d) {
			return d.y;
		});

	return lineFunction(arrayOfNodes);
}

function linkstrengthForD3Force() {
	return function testStrength(link, index) {
		if (link.strength) {
			return link.strength;
		}

		return 0.1;
	}
}

function chargeForD3Force() {
	return function chargeTest(theNode) {
		if (theNode.endPointConnections !== undefined && theNode.endPointConnections.length === 1) {
			return 0;
		}

		if (theNode.width) {
			return theNode.width * (-12);
		}

		return 0;
	}
}
