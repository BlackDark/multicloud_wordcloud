

export default class ShapingHelper {

	static getShiftValuesXY(destinationPointXY, directionsXY, nodeXY, shapeObject) {
		let xDirection = directionsXY[0] < 0 ? -1 : 1;
		let yDirection = directionsXY[1] < 0 ? -1 : 1;
		let index = 0;
		let moveValues = {
			"x": 0,
			"y": 0
		};

		while (index < 2) {
			index = 0;

			if (tryPlacing(xDirection, "x", shapeObject, moveValues, nodeXY, destinationPointXY)) {
				moveValues.x += xDirection;
			} else {
				index++;
			}

			if (tryPlacing(yDirection, "y", shapeObject, moveValues, nodeXY, destinationPointXY)) {
				moveValues.y += yDirection;
			} else {
				index++;
			}
		}

		return moveValues;
	}
}

function tryPlacing(directionValue, directionAttr, shapeObject, moveValues, node, point) {
	if (directionValue < 0 && node[directionAttr] + moveValues[directionAttr] + directionValue < point[directionAttr]) {
		return false;
	}

	if(directionValue > 0 && node[directionAttr] + moveValues[directionAttr] + directionValue > point[directionAttr]) {
		return false;
	}

	let checkPoint = {
		"x": moveValues.x + node.x,
		"y": moveValues.y + node.y
	};

	checkPoint[directionAttr] += directionValue;

	return shapeObject._checkPlacing(checkPoint, node);
}
