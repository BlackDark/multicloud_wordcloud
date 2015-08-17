/*
 * ResponseWordStorage.java
 *
 */

package de.marbach.bachelor.response;

import java.util.List;

/**
 *
 */
public class ResponseWordStorage {

	private final ResponseInformation information;
	private final List<ResponseEndNode> endPoints;
	private final List<ResponseTextNode> textNodes;

	public ResponseWordStorage(ResponseInformation information, List<ResponseEndNode> endPoints, List<ResponseTextNode> textNodes) {
		this.information = information;

		this.endPoints = endPoints;
		this.textNodes = textNodes;
	}

	public ResponseInformation getInformation() {
		return information;
	}

	public List<ResponseTextNode> getTextNodes() {
		return textNodes;
	}

	public List<ResponseEndNode> getEndPoints() {
		return endPoints;
	}
}
