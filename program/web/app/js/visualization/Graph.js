import ForceLayout from "./ForceLayout";
import SampleDataGenerator from "js/visualization/util/SampleDataGenerator";
import CollisionModule from "js/visualization/CollisionModule";
import DebugConfig from "js/visualization/DebugConfig";
import DragBehaviour from "js/visualization/DragBehaviour";

// Shapes
import BaseShape from "js/visualization/shape/BaseShape";
import ShapeRect from "js/visualization/shape/ShapeRectangular";

import NodeSorter from "js/visualization/NodeSorter";

export default class Graph {
	constructor(containerSelector) {
		this.config = new DebugConfig();
		this._svg = d3.select(containerSelector).append("svg").classed("graph", true);
		this._container = this._svg.append("g");
		this._linkContainer = this._container.append("g");
		this._originalPositionLinkContainer = this._container.append("g");
		this._nodeContainer = this._container.append("g");
		this._endPointContainer = this._container.append("g");

		this._force = new ForceLayout(this);
	}

	start() {
		this._redrawGraph();
		this._redrawElements();
		this._configureGraph();
		this._force.start();

	}

	data(endPointsNodes, textNodes, links) {
		this._endPointsNodes = endPointsNodes;
		this._textNodes = textNodes;
		this._links = links;
		console.log(endPointsNodes.concat(textNodes));
		this._force.nodes(endPointsNodes.concat(textNodes));
		this._force.links(links);
	}

	resize(width, height) {
		this._width = width;
		this._height = height;
		this._svg.attr("width", width).attr("height", height);
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
		this._addD3Buttons();
	}

	_addD3Buttons() {
		DebugConfig.addD3ButtonHeader();
		DebugConfig.addButtonForD3(this, this._moveToTopLeftCorner, "Move top left");
		DebugConfig.addButtonForD3(this, this._prepareRectShape, "Try rectangular shape");
		DebugConfig.addButtonForD3(this, this._applyColaJSLayout, "Apply Cola.js");
	}

	_addColaButtons() {
		DebugConfig.addColaButtonHeader();
		DebugConfig.addButtonForD3(this, function() {
			console.log(this._colaForce.nodes());
			this._colaForce.start(10,10,10);
		}, "Restart (?)");

		DebugConfig.addButtonForD3(this, function() {
			this._colaForce.links(this._getLinksForColaForce.call(this));
			this._colaForce.start();
		}.bind(this), "Try circle");

		DebugConfig.addButtonForD3(this, function() {
			this._colaForce.links(this._links);
			this._colaForce.linkDistance(function(link) {
				return this._getLinkDistanceColaForce(link);
			}.bind(this));
			this._colaForce.start(10,10,10);
		}.bind(this), "Use distances");

		DebugConfig.addButtonForD3(this, function() {
			this._textNodes.forEach(function(element) {
				element.x += Math.random() * 8 - 4;
				element.y += Math.random() * 8 - 4;
			});
			this._colaForce.start();
		}.bind(this), "Fire");
	}

	_d3EndFunction() {
		//this._overlapRemoval();
		//this._moveToTopLeftCorner();
		//this._drawOriginalPositionLink();
		//this._markOverlapping();
		//this._applyColaJSLayout();
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

		var colaForce = cola.d3adaptor()
			.avoidOverlaps(true)
			.size([this._width, this._height]);

		this._colaForce = colaForce;

		this._endPointElements.call(function() {
			let dragging = new DragBehaviour(this, colaForce);
			dragging.changeDragFunction(dragging.getMoveNodesBoxWise(this._endPointsNodes));
			return dragging.dragBehaviour
		}.bind(this)());

		let constraintsArray = [];
		let offsetArray = [];

		for(let i = 1; i < this._textNodes.length; i++) {
			constraintsArray.push({
				"axis": "x",
				"left": this._endPointsNodes[0].id,
				"right": i + this._endPointsNodes.length,
				"gap": 100,
				"equality": false
			});

			constraintsArray.push({
				"axis": "x",
				"right": this._endPointsNodes[1].id,
				"left": i + this._endPointsNodes.length,
				"gap": 5,
				"equality": false
			});

			/*
			constraintsArray.push({
				"axis": "y",
				"left": this._endPointsNodes[2].id,
				"right": i + this._endPointsNodes.length,
				"gap": 100
			});

			constraintsArray.push({
				"axis": "y",
				"right": this._endPointsNodes[0].id,
				"left": i + this._endPointsNodes.length,
				"gap": 100
			});
			*/
		}

		let constrainTest = [];

		for(let i = 0; i < this._textNodes.length; i++) {
			constrainTest.push(
				{"axis": "x", "left": i, "right": 4 + i, "gap": 100, "equality": false});
		}

		colaForce.constraints(constraintsArray);

		colaForce.nodes(this._endPointsNodes.concat(this._textNodes));

		//colaForce.start();

		this._textNodes.forEach(function (element) {
			element._container.call(colaForce.drag);
		});

		colaForce.on("tick", function () {
			if(this.config.drawLinksColaForce) {
				this._linkElements.selectAll("path").attr("d", function(link){
					return linkPathFunction([link.source, link.target]);
				});
			}

			this._nodeElements.attr("transform", function (d) {
				return "translate(" + [d.x - d.width / 2, d.y - d.height / 2] + ")";
			});
		}.bind(this));

		//colaForce.on("end", this._markOverlapping.bind(this));
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
		console.log(number);
		return number;
	}

	_removeD3States() {
		this._endPointElements.each(element => element._container.on(".drag", null));
	}

	_prepareRectShape() {
		let shape = new ShapeRect(this._height, this._width, this._endPointsNodes);
		let nodeFinder = new NodeSorter(this._textNodes, this._endPointsNodes);

		// Place 10 nodes for each endpoints
		this._endPointsNodes.forEach(node => {
			for(let i = 0; i < 10; i++) {
				let textNode = nodeFinder.getNodeForEndPoints(node);

				if (textNode === undefined) {
					continue;
				}

				if(shape.placeNearEndPoints(node, textNode)) {
					nodeFinder.placeNode(textNode);
				} else {
					nodeFinder.skipNode(textNode);
				}
			}
		});

		// Try placing all other existing nodes
		while (nodeFinder.hasNodes()) {
			let nodeAndEndPoint = nodeFinder.getNextNodeAndEndPoint();

			if(shape.placeNearEndPoints(nodeAndEndPoint.endPoint, nodeAndEndPoint.node)) {
				nodeFinder.placeNode(nodeAndEndPoint.node);
			} else {
				nodeFinder.skipNode(nodeAndEndPoint.node);
			}
		}

		console.log("TEHEEE");

		let newWordsConstruct = shape.storedWords;
		let newWords = [];

		newWordsConstruct.forEach(element => newWords.push(element.element));

		let skipped = this._textNodes.filter(function(item) {
			return newWords.indexOf(item) === -1;
		});

		skipped.forEach(element => element._container.remove());


		newWordsConstruct.forEach(function(element) {
			element.element.x = element.x;
			element.element.y = element.y;

			element.element._container.transition()
				.duration(750)
				.attr("transform", function (d) {
					return "translate(" + [d.x, d.y] + ")";
				})
		});
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
