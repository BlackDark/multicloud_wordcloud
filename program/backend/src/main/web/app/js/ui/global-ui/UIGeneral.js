export default class UIGeneral {
	constructor() {
		this.visualizedId = undefined;
		this.apply();
		this.resizeEvent();
	}

	apply() {
		var that = this;
		$(document).ready(function () {
			// For tabbing
			$('.menu .item')
				.tab({
					onLoad: function(event, ui) {
						if (event === "visualization") {
							if (that.objectUIGeneral.selectedRow === undefined || that.visualizedId === that.objectUIGeneral.selectedRow) {
								return;
							}

							that.visualizedId = that.objectUIGeneral.selectedRow;

							//test.executeSample();
							$.ajax({
								url: "upload/" + that.visualizedId + "/result",
								success: function (data) {
									that._showVisualization.call(that, data);
								}
							});
						}
					}
				});
		});
	}

	_showVisualization(data) {
		this.objectUIVisualization.showVisualization(data);
	}

	registerUploading(objectUIGeneral) {
		this.objectUIGeneral = objectUIGeneral;
	}

	registerVisualizationObject(objectVisualization) {
		this.objectVisualization = objectVisualization;
	}

	registerUIVisualization(objectUIVisualization) {
		this.objectUIVisualization = objectUIVisualization;
	}

	resizeEvent() {
		this.itemArrayForResize = [];

		let array = this.itemArrayForResize;

		$(window).resize(function() {
			waitForFinalEvent(function(){
				array.forEach(item => item.resize());
			}, 500, "Element resizing");
		})
	}

	registerResizeElement(element) {
		this.itemArrayForResize.push(element);
	}
}

let waitForFinalEvent = (function () {
	var timers = {};
	return function (callback, ms, uniqueId) {
		if (!uniqueId) {
			uniqueId = "Don't call this twice without a uniqueId";
		}
		if (timers[uniqueId]) {
			clearTimeout (timers[uniqueId]);
		}
		timers[uniqueId] = setTimeout(callback, ms);
	};
})();

