/*
 * ResponseEndNode.java
 *
 */

package de.marbach.bachelor.response;

/**
 *
 */
public class ResponseEndNode {

	private final String documentName;
	private final Integer index;

	public ResponseEndNode(String documentName, Integer index) {
		this.documentName = documentName;
		this.index = index;
	}

	public String getDocumentName() {
		return documentName;
	}

	public Integer getIndex() {
		return index;
	}

}
