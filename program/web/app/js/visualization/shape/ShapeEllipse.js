import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeEllipse extends BaseShape {
	constructor(height, width, endpoints) {
		super(...arguments);

		this._a = this._width / 2;
		this._b = this._height / 2;
	}

	_initializeFieldValues() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = !inEllipse.call(this, i, j);

				if (!this._field[i][j]) {
					this._possiblePixels.push({
						"x": i,
						"y": j
					});
				}
			}
		}

		function inEllipse(x, y) {
			return (Math.pow((x - this._center.x), 2) / Math.pow(this._a, 2)) + (Math.pow((y - this._center.y), 2) / Math.pow(this._b, 2)) <= 1;
		}
	}

}
