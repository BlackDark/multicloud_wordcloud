import GraphVisualization from "./Graph";
import Parser from "./Parser";
import SampleDataGenerator from "./util/SampleDataGenerator";
import ResponseParser from "./ResponseParser";

export default class VisualzationInitializer {
	constructor() {
		this._currentGraph = undefined;
		this._graphSelector = "#graph";
		this._currentId = undefined;
	}

	get currentGraph() {
		return this._currentGraph;
	}

	get currentId() {
		return this._currentId;
	}

	set currentId(id) {
		this._currentId = id;
	}

	cleanVisualization() {
		d3.select(this._graphSelector).select("svg").remove();
	}

	executeSample() {
		var graphContainerSelector = "#graph";
		var selectedGraph = d3.select(graphContainerSelector);
		var graph = new GraphVisualization(graphContainerSelector);
		var width = selectedGraph.property("offsetWidth");
		var height = selectedGraph.property("offsetHeight");
		graph.resize(width, height);

		console.log([width, height]);

		var generator = new SampleDataGenerator(4, 200, width, height);
		generator.generateObjects();
		var data = Parser.parse({
			endpoints: generator.endPoints,
			textObjects: generator.textObjects,
			links: generator.links
		});

		graph.data(data.endPoints, data.textObjects, data.links);

		this._currentGraph = graph;
		graph.start();
	}

	execute(responseData) {
		var graphContainerSelector = "#graph";
		var selectedGraph = d3.select(graphContainerSelector);
		var graph = new GraphVisualization(graphContainerSelector);
		var querySvgGraph = $('#svgGraph');
		var width = +querySvgGraph.width();
		var height = +querySvgGraph.height();
		graph.resize(width, height);

		console.log([width, height]);
		let data = ResponseParser.parse(responseData, width, height);

		console.log(data);
		graph.data(data);

		this._currentGraph = graph;
		graph.start();
	}

	resize(width, height) {
		if(this._currentGraph) {
			this._currentGraph.resize(width, height);
		}
	}
}

//Parser.parse("data/ExampleData.csv", data => { graph.data(data).start(); });
