export default class UIGeneral {
	constructor() {
		this.visualizedId = undefined;
		this.apply();
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
									that._thatShowVisualization.call(that, data);
								}
							});
						}
					}
				});
		});
	}

	_thatShowVisualization(data) {
		if(data === undefined) {
			return;
		}

		if(data.textNodes.length === 0) {
			$('#visualizationEmpty').removeClass('hidden');
			$('#visualizationNotReady').addClass('hidden');
			$('#graph').addClass('hidden');

			return;
		}

		$('#visualizationNotReady').addClass('hidden');
		$('#visualizationEmpty').addClass('hidden');
		$('#graph').removeClass('hidden');

		this.objectVisualization.cleanVisualization();
		this.objectVisualization.execute(data);
	}

	registerUploading(objectUIGeneral) {
		this.objectUIGeneral = objectUIGeneral;
	}

	registerVisualizationObject(objectVisualization) {
		this.objectVisualization = objectVisualization;
	}
}

