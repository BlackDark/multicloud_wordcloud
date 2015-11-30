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
	private final Integer numWords;

	public ResponseEndNode(String documentName, Integer index, List<ResponseTextNode> textNodes, Integer numWords) {
		this.documentName = documentName;
		this.index = index;
		this.textNodes = textNodes;
		this.numWords = numWords;
	}

	public Integer getNumWords() {
		return numWords;
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
