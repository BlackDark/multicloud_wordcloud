export default class StringExt {
	static widthText(text, textStyle, size) {
		// Set a default value
		if (!textStyle) {
			textStyle = "textForWidth";
		}

		var d = d3.select("body")
				.append("div")
				.attr("class", textStyle)
				.attr("id", "width-test") // tag this element to identify it
				.style("font-size", size + "px")
				.text(text),
			w = document.getElementById("width-test").offsetWidth;
		d.remove();
		return w;
	}
}
