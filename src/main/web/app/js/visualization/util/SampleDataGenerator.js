import StringExt from "./StringExt";

export default class SampleDataGenerator {
	constructor(numberOfDocuments, numberOfWords, width, height) {
		this._numDocs = numberOfDocuments;
		this._numWords = numberOfWords;
		this._width = width;
		this._height = height;
		this._endPoints = undefined;
		this._textObjects = undefined;
	}

	generateObjects() {
		this._endPoints = this.getEndPoints(this._numDocs);
		this._textObjects = this.getTextObjects(SampleDataGenerator.getWordsArrayForLength(this._numWords), this._numDocs);
		this._links = SampleDataGenerator.createLinks(this._endPoints.concat(this._textObjects), this._endPoints.length);

		console.log(this._textObjects.length + " words.");
	}

	get endPoints() {
		return this._endPoints;
	}

	get textObjects() {
		return this._textObjects;
	}

	get links() {
		return this._links;
	}

	static getWordsArrayForLength(length) {
		let text = "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when simply dummy text of the printing and typesetting industry.";
		let tokenArray = text.split(" ");

		if(length < tokenArray.length) {
			return tokenArray.slice(0, length);
		}

		let newLength = length;
		let newWordArray = [];

		while(newLength > tokenArray.length) {
			newWordArray = newWordArray.concat(tokenArray);
			newLength -= tokenArray.length;
		}

		newWordArray = newWordArray.concat(tokenArray.slice(0, newLength));

		return newWordArray;
	}

	getEndPoints() {
		return [
			{
				text: "End1",
				x: 5,
				y: 5,
				fixed: true,
				id: 0
			},
			{
				text: "End2",
				x: this._width - 5,
				y: 5,
				fixed: true,
				id: 1
			},
			{
				text: "End3",
				x: 5,
				y: this._height - 5,
				fixed: true,
				id: 2
			},
			{
				text: "End4",
				x: this._width - 5,
				y: this._height - 5,
				fixed: true,
				id: 3
			}
		];
	}

	getTextObjects(tokenArray) {
		let objects = [];
		let index = 4;

		tokenArray.forEach(function (entry) {
			let distr = SampleDataGenerator.getRandomDistribution(4);
			let height = Math.floor(Math.random() * 40 + 10);
			//var height = 12;
			var object = {
				text: entry,
				size: height,
				width: StringExt.widthText(entry, undefined, height),
				height: height,
				endPointConnections: [],
				id: +index
			};
			object.endPointConnections = distr;

			objects.push(object);
			index++;
		});

		return objects;
	}

	static createLinks(nodes, number) {
		var newLinks = [];
		var index = 0;

		for (var i = number; i < nodes.length; i++) {
			var currentNode = nodes[i];

			currentNode.endPointConnections.forEach(function (strength, i) {
				newLinks.push({
					id: index++,
					source: currentNode.id,
					target: i,
					strength: strength
				});
			});
		}

		return newLinks;
	}

	static getRandomDistribution(numNumbers) {
		var randomNumers = [];

		for (var i = 0; i < numNumbers - 1; i++) {
			randomNumers.push(Math.random());
		}

		randomNumers.sort(function (a, b) {
			return a - b
		});

		var recalc = [];

		for (var j = 0; j < numNumbers; j++) {
			if (j === 0) {
				recalc.push(randomNumers[j] - 0);
				continue;
			}

			if (j === numNumbers - 1) {
				recalc.push(1 - randomNumers[j - 1]);
				continue;
			}

			recalc.push(randomNumers[j] - randomNumers[j - 1]);

		}
		return SampleDataGenerator.shuffle(recalc);
	}

	static shuffle(o) {
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	}
}
