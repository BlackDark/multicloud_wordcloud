
import GeneratorUtil from "js/visualization/util/GeneratorUtil";

export default class NodeSorter {
	constructor(nodes, endPoints) {
		this._nodes = nodes;
		this._endPoints = endPoints;
		this._skippedNodes = [];
		this._placedNodes = [];
		this._roundIndex = 0;
		this._sortingNodes();
	}

	get processValue() {
		return (this._skippedNodes.length + this._placedNodes.length) / this._nodes.length;
	}

	get placedNodes() {
		return this._placedNodes;
	}

	get skippedNodes() {
		return this._skippedNodes;
	}

	reset() {
		this._endToNode = GeneratorUtil.copyMapObjectToArray(this._originalEndToNode);
		this._placedNodes.length = 0;
		this._skippedNodes.length = 0;
		this._roundIndex = 0;
	}

	hasNodes() {
		for(let key of this._endToNode.keys()) {
			if(this._endToNode.get(key).length !== 0) {
				return true;
			}
		}

		return false;
	}

	getNodeForEndPoints(endpoint) {
		return this._endToNode.get(endpoint)[0];
	}

	placeNode(node) {
		this._placedNodes.push(node);
		this._removeNodeFromLists(node);
	}

	skipNode(node) {
		this._skippedNodes.push(node);
		this._removeNodeFromLists(node);
	}

	_removeNodeFromLists(node) {
		for(let key of this._endToNode.keys()) {
			let array = this._endToNode.get(key);
			array = array.splice(array.indexOf(node), 1);
		}
	}

	// Iterate through the endpoint and give node back
	getNextNodeAndEndPoint() {
		var endPoint = this._endPoints[this._roundIndex];
		let node = this._endToNode.get(endPoint)[0];

		if(this._roundIndex === this._endPoints.length - 1) {
			this._roundIndex = 0;
		} else {
			this._roundIndex++;
		}

		return {
			"node": node,
			"endPoint": endPoint
		};
	}

	_sortingNodes() {
		this._endToNode = new Map();

		this._endPoints.forEach(node => {
			this._endToNode.set(node, sortNodesToPoint(node, this._nodes));
		});

		this._originalEndToNode = GeneratorUtil.copyMapObjectToArray(this._endToNode);
	}
}

function sortNodesToPoint(point, nodes) {
	let unsorted = [].concat(nodes);

	unsorted.sort(function (a, b) {
		let aDistance = Math.sqrt(Math.pow(a.x - point.x, 2) + Math.pow(a.y - point.y, 2));
		let bDistance = Math.sqrt(Math.pow(b.x - point.x, 2) + Math.pow(b.y - point.y, 2));
		return aDistance - bDistance;
	});

	return unsorted;
}
