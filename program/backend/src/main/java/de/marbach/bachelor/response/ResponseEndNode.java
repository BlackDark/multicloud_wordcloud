/*
 * ResponseEndNode.java
 *
 */

package de.marbach.bachelor.response;

import java.util.List;

/**
 *
 */
public class ResponseEndNode {

	private final String documentName;
	private final Integer index;
	private final List<ResponseTextNode> textNodes;

	public ResponseEndNode(String documentName, Integer index, List<ResponseTextNode> textNodes) {
		this.documentName = documentName;
		this.index = index;
		this.textNodes = textNodes;
	}

	public String getDocumentName() {
		return documentName;
	}

	public Integer getIndex() {
		return index;
	}

	public List<ResponseTextNode> getTextNodes() {
		return textNodes;
	}
}
