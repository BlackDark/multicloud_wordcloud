

const color = d3.scale.category10().domain(d3.range(10));

export default class GeneratorUtil {

	// Depending on parameters multi-dimensional arrays are created.
	// Eq. (3) creates [0,0,0] and (3,2) creates [ [0,0], [0,0], [0,0]] etc.
	static _createArray(length) {
		let lengthAsInteger = parseInt(length, 10);
		let arr = new Array(lengthAsInteger || 0);
		let i = lengthAsInteger;

		if (arguments.length > 1) {
			let args = Array.prototype.slice.call(arguments, 1);
			while (i--) arr[lengthAsInteger - 1 - i] = GeneratorUtil._createArray.apply(this, args);
		}

		return arr;
	}

	static copyMapObjectToArray(oldMap) {
		let newMap = new Map();

		for (let [key, value] of oldMap) {
			let copyArray = [].concat(value);
			newMap.set(key, copyArray);
		}

		return newMap;
	}

	static copyField(field) {
		let newField = GeneratorUtil._createArray(field.length, field[0].length);

		for(let i = 0; i < field.length; i++) {
			for(let j = 0; j < field[0].length; j++) {
				newField[i][j] = field[i][j];
			}
		}

		return newField;
	}

	static getColorForId(id) {
		return color(id);
	}
}
