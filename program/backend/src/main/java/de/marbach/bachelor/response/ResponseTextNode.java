/*
 * ResponseTextNodes.java
 *
 */

package de.marbach.bachelor.response;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 *
 */
public class ResponseTextNode {

	private final String text;
	private final int frequency;
	private final List<ResponseDocumentConnection> endPointConnections;
	private final List<String> posTags;

	public ResponseTextNode(String text, int frequency, List<ResponseDocumentConnection> endPointConnections, Collection<String> posTags) {
		this.text = text;
		this.frequency = frequency;
		this.endPointConnections = endPointConnections;
		this.posTags = new ArrayList<>(posTags);
	}

	public List<String> getPosTags() {
		return posTags;
	}

	public String getText() {
		return text;
	}

	public int getFrequency() {
		return frequency;
	}

	public List<ResponseDocumentConnection> getEndPointConnections() {
		return endPointConnections;
	}
}
