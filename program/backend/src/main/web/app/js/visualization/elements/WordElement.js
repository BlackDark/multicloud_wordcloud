import BaseElement from "js/visualization/elements/BaseElement";
import StringExt from "js/visualization/util/StringExt";

const color = d3.scale.category10();
const emDivisor = 11;
const widthPadding = 4;
const heightPaddingReduceFactor = 0.2;

export default class WordElement extends BaseElement{
	constructor(id) {
		super(id);
	}

	getSize() {
		return this.size;
	}

	changeSize(newSize) {
		this.size = newSize;
		this._container.select("text")
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; });
		setDimensions(this);
	}

	incrementSize() {
		this.changeSize(this.size + 1);
	}

	decrementSize() {
		this.changeSize(this.size - 1);
	}

	draw(container) {
		let that = this;
		super.draw(container);

		let index;

		this._textSelectedDom = container.append("text")
			.classed("word-text", true)
			.style("fill", function(d, i) {
				index = d.endPointConnections.indexOf(Math.max.apply(Math, d.endPointConnections));
				return color(index);
			})
			.style("opacity", d => d.endPointConnections[index])
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; })
			.text(function(d) {
				return d.text;
			});

		setDimensions(this);

		this.tipsySelector = $(container.node()).find("text");
		this.tipsySelector.tipsy({
			gravity: 'w',
			html: true,
			title: function() {
				var getChart = that._getChart();
				return getChart[0];
			},
			delayIn: 150,
			delayOut: 200
		});
	}

	hover(hovered) {
		this._container.classed("hovered", hovered);
		this._textSelectedDom.classed("hovered", hovered);
	}

	_getChart() {
		let that = this;
		$('#chartTest').empty();

		var chart = nv.models.pieChart()
				.x(function(d) { return d.index})
				.y(function(d) { return d.value})
				.color(function(d) {
					return color(d.index);
				})
				.showLabels(true)
				.labelThreshold(.5)  //Configure the minimum slice size for labels to show up
			;

		let chartData =[];
		that.endPointConnections.forEach(function(el, i) {
			chartData.push({
				"index": i,
				"value": el
			});
		});

		let svgTe = d3.select('#chartTest').append("svg")
			.datum(chartData)
			.transition().duration(1200)
			.call(chart);

		let divClone = $('#chartTest').clone();
		divClone.attr("id", "toolChart");
		divClone.empty();
		d3.select(divClone[0]).node().appendChild(svgTe.node());

		return divClone;
	}

	_getDocumentConnectionAsString() {
		let documentString = "";

		this.endPointConnections.forEach(function(element, index) {
			documentString = documentString.concat('Document ' + index + ": " + Math.round((element * 100)) + '%<br>');
		});

		return documentString;
	}
}

function setDimensions(object) {
	let rect = object._container.select("text").node().getBoundingClientRect();
	object.height = rect.height - rect.height * heightPaddingReduceFactor;
	object.width = rect.width + widthPadding;
}
