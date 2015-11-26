import BaseElement from "js/visualization/elements/BaseElement";
import StringExt from "js/visualization/util/StringExt";
import GeneratorUtil from "../util/GeneratorUtil";

const emDivisor = 11;
const widthPadding = 4;
const heightPaddingReduceFactor = 0.2;
const saturationMin = 0.3;
const saturationMax = 0.8;

export default class WordElement extends BaseElement{
	constructor(id) {
		super(id);
	}

	getSize() {
		return this.size;
	}

	changeSize(newSize) {
		if (newSize <= 0) {
			return false;
		}

		this.size = newSize;
		this._container.select("text")
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; });
		setDimensions(this);
		return true;
	}

	incrementSize() {
		return this.changeSize(this.size + 1);
	}

	decrementSize() {
		return this.changeSize(this.size - 1);
	}

	draw(container) {
		let that = this;
		super.draw(container);

		let highestConnectionId = undefined;

		let highest = Number.NEGATIVE_INFINITY;
		let tmp;
		for (let i=this.endPointConnections.length-1; i>=0; i--) {
			tmp = this.endPointConnections[i].distribution;
			if (tmp > highest) {
				highestConnectionId = i;
				highest = tmp;
			}
		}

		this.mostConnectedDocument = that.endPointConnections[highestConnectionId].documentId;

		d3.select("defs").append("filter")
		.attr("id", "filter" + this.id)
		.append("feColorMatrix")
		.attr("type", "saturate")
		.attr("values", saturationScale(this.endPointConnections[highestConnectionId].distribution));

		this._textSelectedDom = container.append("text")
			.classed("word-text", true)
			.style("fill", function(d, i) {
				return GeneratorUtil.getColorForId(that.endPointConnections[highestConnectionId].documentId);
			})
			.style("filter", d => {
				return 'url(#filter' + d.id + ')';
			})
			.style("font-size", function(d) {
				return d.size / emDivisor + "em"; })
			.text(function(d) {
				return d.text;
			});

		setDimensions(this);

		this.tipsySelector = $(container.node()).find("text");

		this.tipsySelector.popup({
			position: "right center",
			hoverable: true,
			html: function() {
				let tooltipDiv = document.createElement("div");
				let elementInformationDiv = d3.select(document.createElement("div"));
				elementInformationDiv.append("p").text("Frequency: " + that.frequency);
				elementInformationDiv.append("p").text("NLP tags: " + that.posTags);
				tooltipDiv.appendChild(elementInformationDiv.node());
				var getChart = that._getChart();
				tooltipDiv.appendChild(getChart[0]);
				return tooltipDiv;
			},
			delay: {
				show: 150,
				hide: 200
			}
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
				.x(function(d) { return d.title})
				.y(function(d) { return d.value})
				.color(function(d) {
					return GeneratorUtil.getColorForId(d.index);
				})
				.showLabels(true)
				.labelThreshold(.5)  //Configure the minimum slice size for labels to show up
			;

		let chartData =[];
		that.endPointConnections.forEach(function(el, i) {
			let filename;

			if (el.endpoint.name.length > 10) {
				filename = el.endpoint.name.substring(0, 10) + "...";
			} else {
				filename = el.endpoint.name;
			}

			chartData.push({
				"index": el.endpoint.id,
				"title": filename,
				"value": el.distribution
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

function saturationScale(value) {
	if( value <= saturationMin ) {
		return 0;
	}
	return (1 / (saturationMax - saturationMin)) * (value - saturationMin);
}
