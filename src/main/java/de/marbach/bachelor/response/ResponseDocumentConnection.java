/*
 * ResponseDocumentConnection.java
 *
 */

package de.marbach.bachelor.response;

/**
 *
 */
public class ResponseDocumentConnection {
	private final Integer documentId;
	private final Integer frequency;

	public ResponseDocumentConnection(Integer documentId, Integer frequency) {
		this.documentId = documentId;
		this.frequency = frequency;
	}

	public Integer getFrequency() {
		return frequency;
	}

	public Integer getDocumentId() {
		return documentId;
	}
}
