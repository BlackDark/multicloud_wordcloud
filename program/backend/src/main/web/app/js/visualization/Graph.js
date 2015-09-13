import ForceLayout from "js/visualization/layouts/D3ForceLayout";
import ColaLayout from "js/visualization/layouts/ColaJSForceLayout";

import SampleDataGenerator from "js/visualization/util/SampleDataGenerator";
import CollisionModule from "js/visualization/CollisionModule";
import DebugConfig from "js/visualization/DebugConfig";
import DragBehaviour from "js/visualization/DragBehaviour";

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
	}

	get graphStatistics() {
		return this._graphStatistics;
	}

	start() {
		this._redrawGraph();
		this._redrawElements();
		this._configureGraph();
		this._updateStats();
		this._force.start();
	}

	data(endPointsNodes, textNodes, links) {
		this._endPointsNodes = endPointsNodes;
		this._textNodes = textNodes;
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

	}

	_redrawElements() {
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
			});
	}

	_configureGraph() {
		this._force.tick(tickForD3Force.call(this, this._linkElements, this._nodeElements));
		this._force.changeLinkStrength(linkstrengthForD3Force());
		this._force.changeCharge(chargeForD3Force());
		this._force.onEnd(this._d3EndFunction.bind(this));

		this._endPointElements.call(function() {
			let dragging = new DragBehaviour(this, this._force);
			return dragging.dragBehaviour
		}.bind(this)());
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

	_moveToTopLeftCorner() {
		var uncheckedNodes = boundsSortedNodes(this._textNodes);
		var checkedNodes = [];
		var restKnoten = [].concat(uncheckedNodes);
		//uncheckedNodes = uncheckedNodes.slice(0, 1);


		// TODO not correct bounds
		var bounds = {
			x0: 0,
			y0: 0,
			x1: this._width,
			y1: this._height
		};

		uncheckedNodes.forEach(function (currentNode) {
			// Remove this node from other nodes
			restKnoten = restKnoten.splice(1, restKnoten.length);

			var movable = CollisionModule.isInBounds(currentNode, bounds);

			while (movable) {
				var failMove = 0;

				currentNode.x = currentNode.x - 2;

				if (!CollisionModule.isInBounds(currentNode, bounds) || CollisionModule.testOverlap(currentNode, checkedNodes)) {
					currentNode.x = currentNode.x + 2;
					failMove++;
				}

				currentNode.y = currentNode.y - 2;

				if (!CollisionModule.isInBounds(currentNode, bounds) || CollisionModule.testOverlap(currentNode, checkedNodes)) {
					currentNode.y = currentNode.y + 2;
					failMove++;
				}

				if (failMove === 2) {
					movable = false;
				}
			}

			checkedNodes.push(currentNode);
			currentNode._container.transition()
				.duration(750)
				.delay(10 * checkedNodes.length)
				.attr("transform", function (d) {
					return "translate(" + [d.x, d.y] + ")";
				})
		}.bind(this));

		// Moving the nodes flawlessy
		/*
		 node.transition()
		 .duration(750)
		 .attr("transform", function(d) {
		 return "translate(" + [d.x, d.y] + ")";
		 });
		 */
	}

	// Not working i think
	_overlapRemoval() {
		for (var i = 0; i < this.config.collisionRemovalTimes; i++) {
			var q = d3.geom.quadtree(this._textNodes),
				j = 3,
				n = this._textNodes.length;

			while (++j < n) {
				q.visit(CollisionModule.collide(this._textNodes[j]));
			}
		}
	}

	_applyColaJSLayout() {
		this._removeD3States();
		this._addColaButtons();

		this._colaForce = new ColaLayout(this);

		this._endPointElements.call(function() {
			let dragging = new DragBehaviour(this, this._colaForce);
			dragging.changeDragFunction(dragging.getMoveNodesBoxWise(this._endPointsNodes));
			return dragging.dragBehaviour
		}.bind(this)());

		this._colaForce.nodes(this._endPointsNodes.concat(this._textNodes));

		this._textNodes.forEach(function (element) {
			element._container.call(this._colaForce.layoutObject.drag);
		}.bind(this));

		this._colaForce.tick(function () {
			if(this.config.drawLinksColaForce) {
				this._linkElements.selectAll("path").attr("d", function(link){
					return linkPathFunction([link.source, link.target]);
				});
			}

			this._nodeElements.attr("transform", function (d) {
				return "translate(" + [d.x - d.width / 2, d.y - d.height / 2] + ")";
			});
		}.bind(this));
	}

	_drawOriginalPositionLink() {
		for (var i = 0; i < this._textNodes.length; i++) {
			var currentNode = this._textNodes[i];

			var positionX = 0;
			this._endPointsNodes.forEach(function(d, i) {
				positionX += d.x * currentNode.endPointConnections[i];
			});

			var positionY = 0;
				this._endPointsNodes.forEach(function(d, i) {
					positionY += d.y * currentNode.endPointConnections[i];
				});

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
					return positionX;
				})
				.attr("y2", function (d) {
					return positionY;
				});
		}
	}

	_markOverlapping() {
		this._textNodes.forEach(function (element) {
			if (CollisionModule.testOverlap(element, this._textNodes)) {
				element._container.classed("overlap", true);
			}
		}.bind(this));
	}

	_getLinksForColaForce() {
		return this._links;
	}

	_getLinkDistanceColaForce(link) {
		var number = 20 / link.strength;
		return number;
	}

	_removeD3States() {
		this._endPointElements.each(element => element._container.on(".drag", null));
	}

	// Applying a shape to the wordcloud.
	_applyLayout(uiShapeParameterObject) {
		this._force.stop();

		let layoutApplier = new ShapeApplier(uiShapeParameterObject.parameterObject, this._textNodes, this._endPointsNodes);
		this._currentLayout = layoutApplier;
		//layoutApplier.registerProgressListener(new UIProgress(d3.select("#forbutton")));
		layoutApplier.startShaping(this._height, this._width);
	}

	_testCentration() {
		this._currentLayout._shiftMiddle();
	}

	_updateStats() {
		this._graphStatistics.updateStats.call(this._graphStatistics);
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
			link.selectAll("path").attr("d", function(link){
				return linkPathFunction([link.source, link.target]);
			});
		}

		/* TODO Collision detection removed
		 var q = d3.geom.quadtree(this._textNodes),
		 i = 3,
		 n = this._textNodes.length;

		 while (++i < n) {
		 q.visit(CollisionModule.collide(this._textNodes[i]));
		 }
		 */


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
		if (theNode.width) {
			return theNode.width * (-4);
		}

		return 0;
	}
}
