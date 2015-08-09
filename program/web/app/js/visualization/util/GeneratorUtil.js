

export default class GeneratorUtil {

	// Depending on parameters multi-dimensional arrays are created.
	// Eq. (3) creates [0,0,0] and (3,2) creates [ [0,0], [0,0], [0,0]] etc.
	static _createArray(length) {
		let arr = new Array(length || 0),
			i = length;

		if (arguments.length > 1) {
			let args = Array.prototype.slice.call(arguments, 1);
			while (i--) arr[length - 1 - i] = GeneratorUtil._createArray.apply(this, args);
		}

		return arr;
	}
}
