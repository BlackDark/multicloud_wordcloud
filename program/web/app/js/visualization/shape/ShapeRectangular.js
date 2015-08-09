import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeRectangular extends BaseShape {
	constructor() {
		super(...arguments);

		this._field = this._createField();
		this._initializeFieldValues();
		this._center = {
			"x": this._width / 2,
			"y": this._height / 2
		};

		this._wordStorage = [];
	}


	get storedWords() {
		return this._wordStorage;
	}

	_createField() {
		let field = new Array(this._width);
		for (let i = 0; i < this._width; i++) {
			field[i] = new Array(this._height);
		}

		return field;
	}

	_initializeFieldValues() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = false;
			}
		}
	}

	inBounds(element) {

		return false;
	}

	placeTest(endpoint, element) {
		let distanceObjectsArray = this._calculatePixelDistanceOrder(endpoint);

		for(let dis of distanceObjectsArray) {
			if (this._place(dis, element)) {
				return true;
			}
		}

		return false;
	}

	placeNearEndPoints(endpoint, element) {
		return this.placeTest(endpoint, element);

	}

	// Not working properly
	_oldPlaceNearEndPoints(endpoint, element) {
		// up - down - right - left
		let moveIndexes = [1, 1, 1, 1];

		if (this._place(endpoint, element)) {
			return true;
		}

		while (this._canMove(moveIndexes, endpoint)) {
			let directionMin = Math.min.apply(null, moveIndexes);
			let directionIndex = moveIndexes.indexOf(directionMin);

			if (!this._canMoveInDirection(endpoint, moveIndexes, directionIndex)) {
				moveIndexes[directionIndex]++;
				continue;
			}

			switch (directionIndex) {
				case 0:
					if (this._place(this._getXYCoord(endpoint, null, (-1) * moveIndexes[directionIndex]), element)) {
						return true;
					}
					break;
				case 1:
					if (this._place(this._getXYCoord(endpoint, null, moveIndexes[directionIndex]), element)) {
						return true;
					}
					break;
				case 2:
					if (this._place(this._getXYCoord(endpoint, moveIndexes[directionIndex], null), element)) {
						return true;
					}
					break;
				case 3:
					if (this._place(this._getXYCoord(endpoint, (-1) * moveIndexes[directionIndex], null), element)) {
						return true;
					}
					break;
				default:
					throw "Default case should never be reached!";
			}

			moveIndexes[directionIndex]++;
		}

		return false;
	}

	// Returns an array sorted in distance of the elements to the endpoint.
	_calculatePixelDistanceOrder(endPoint) {
		let distanceAndElement = [];

		for (let yIndex = 0; yIndex< this._height; yIndex++) {
			for (let xIndex = 0; xIndex < this._width; xIndex++) {
				let dx = endPoint.x - xIndex;
				let dy = endPoint.y - yIndex;

				distanceAndElement.push({
					"distance": Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)),
					"x": xIndex,
					"y": yIndex
				});
			}
		}

		distanceAndElement.sort(function(a,b) {
			return a.distance - b.distance;
		});

		return distanceAndElement;
	}

	// Calculate order from view of increasing circle radius.
	// SLOW because n^3 and lot of pixels to test
	_calculatePixelOrderForTesting(endPoint) {
		let maxRadius = this._width > this._height ? this._width / 2 : this._height / 2;

		let usedPixels = this._createArray(this._width, this._height);
		let pixelOrder = [];


		for (let radiusIndex = 0; radiusIndex < maxRadius; radiusIndex++) {
			for (let yIndex = 0 - radiusIndex; yIndex <= radiusIndex; yIndex++) {
				// Skip if out of bounds
				if(endPoint.y + yIndex >= this._height ||endPoint.y + yIndex < 0 ) {
					continue;
				}

				for (let xIndex = 0 - radiusIndex; xIndex <= radiusIndex; xIndex++) {
					// Skip if out of bounds
					if(endPoint.x + xIndex >= this._width ||endPoint.x + xIndex < 0 ) {
						continue;
					}

					if(usedPixels[endPoint.x + xIndex][endPoint.y + yIndex] === true || !inCircle(endPoint.x + xIndex, endPoint.y + yIndex, radiusIndex)) {
						continue;
					}

					usedPixels[endPoint.x + xIndex][endPoint.y + yIndex] = true;
					pixelOrder.push({
						"x": endPoint.x + xIndex,
						"y": endPoint.y + yIndex
					});
				}
			}
		}

		return pixelOrder;

		function inCircle(x, y, radius) {
			return Math.pow((x - endPoint.x), 2) + Math.pow((y - endPoint.y), 2) <= Math.pow(radius, 2);
		}
	}

	// Depending on parameters multi-dimensional arrays are created.
	// Eq. (3) creates [0,0,0] and (3,2) creates [ [0,0], [0,0], [0,0]] etc.
	_createArray(length) {
		let arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			let args = Array.prototype.slice.call(arguments, 1);
			while (i--) arr[length - 1 - i] = this._createArray.apply(this, args);
		}

		return arr;
	}

	// xDif or yDif should be set. Also should be either negativ or positive for direction
	_getXYCoord(coord, xDif, yDif) {
		if (xDif) {
			return {
				"x": coord.x + xDif,
				"y": coord.y
			}
		} else {
			return {
				"x": coord.x,
				"y": coord.y + yDif
			}
		}
	}

	_place(coord, element) {
		// Look if enough free space
		for (let yIndex = coord.y; yIndex < coord.y + element.height; yIndex++) {
			for (let xIndex = coord.x; xIndex < coord.x + element.width; xIndex++) {
				if (this._width <= coord.x + element.width || this._height <= coord.y + element.height || this._field[xIndex][yIndex]) {
					return false;
				}
			}
		}

		// Store word
		for (let yIndex = coord.y; yIndex < coord.y + element.height; yIndex++) {
			for (let xIndex = coord.x; xIndex < coord.x + element.width; xIndex++) {
				this._field[xIndex][yIndex] = true;
			}
		}

		this._wordStorage.push({
			"x": coord.x,
			"y": coord.y,
			"element": element
		});
		return true;
	}

	getEndPoints() {

		return null;
	}

	_canMove(moveIndexes, endpoint) {
		return endpoint.x + moveIndexes[2] < this._width || endpoint.x - moveIndexes[3] >= 0 || endpoint.y + moveIndexes[1] < this._height || endpoint.y - moveIndexes[0] >= 0;
	}

	_canMoveInDirection(endpoint, moveIndexes, directionIndex) {
		switch (directionIndex) {
			case 0:
				return endpoint.y - moveIndexes[0] >= 0;
			case 1:
				return endpoint.y + moveIndexes[1] < this._height;
			case 2:
				return endpoint.x + moveIndexes[2] < this._width;
			case 3:
				return endpoint.x - moveIndexes[3] >= 0;
			default:
				throw "Default case should never be reached in _canMoveInDirection(..)!";
		}
	}
}
