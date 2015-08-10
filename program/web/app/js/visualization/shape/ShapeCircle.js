import BaseShape from "js/visualization/shape/BaseShape";

export default class ShapeCircle extends BaseShape {
	constructor(height, width, endpoints) {
		super(...arguments);

		this._radius = this._width < this._height ? this._width / 2 : this._height / 2;
	}

	_initializeFieldValues() {
		for (let i = 0; i < this._field.length; i++) {
			for (let j = 0; j < this._field[i].length; j++) {
				this._field[i][j] = !inCircle.call(this, i, j);

				if(!this._field[i][j]) {
					this._possiblePixels.push({
						"x": i,
						"y": j
					});
				}
			}
		}

		function inCircle(x, y) {
			return Math.pow((x - this._center.x), 2) + Math.pow((y - this._center.y), 2) <= Math.pow(this._radius, 2);
		}
	}
}
