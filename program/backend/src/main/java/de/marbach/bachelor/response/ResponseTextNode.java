/*
 * ResponseTextNodes.java
 *
 */

package de.marbach.bachelor.response;

import java.util.List;

/**
 *
 */
public class ResponseTextNode {

	private final String text;
	private final int frequency;
	private final List<Integer> endPointConnections;

	public ResponseTextNode(String text, int frequency, List<Integer> endPointConnections) {

		this.text = text;
		this.frequency = frequency;
		this.endPointConnections = endPointConnections;
	}

	public String getText() {
		return text;
	}

	public int getFrequency() {
		return frequency;
	}

	public List<Integer> getEndPointConnections() {
		return endPointConnections;
	}
}
