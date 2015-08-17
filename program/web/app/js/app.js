import GraphVisualization from "./visualization/Graph";
import Parser from "js/visualization/Parser";
import SampleDataGenerator from "js/visualization/util/SampleDataGenerator";
import ResponseParser from "js/visualization/ResponseParser";

export default class app {
	static executeSample() {
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

		graph.start();
	}

	static execute(responseData) {
		var graphContainerSelector = "#graph";
		var selectedGraph = d3.select(graphContainerSelector);
		var graph = new GraphVisualization(graphContainerSelector);
		var width = selectedGraph.property("offsetWidth");
		var height = selectedGraph.property("offsetHeight");
		graph.resize(width, height);

		console.log([width, height]);
		let data = ResponseParser.parse(responseData, width, height);

		console.log(data);
		graph.data(data.endPoints, data.textObjects, data.links);

		graph.start();
	}
}

//Parser.parse("data/ExampleData.csv", data => { graph.data(data).start(); });
