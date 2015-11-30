/*
 * ResponseInformation.java
 *
 */

package de.marbach.bachelor.response;

/**
 *
 */
public class ResponseInformation {
	private final Integer requestedNumWords;
	private final Integer totalNumWords;
	private final Integer totalAllWords;

	public ResponseInformation(Integer requestedNumWords, Integer totalNumWords, Integer totalAllWords) {
		this.requestedNumWords = requestedNumWords;
		this.totalNumWords = totalNumWords;
		this.totalAllWords = totalAllWords;

	}

	public Integer getTotalAllWords() {
		return totalAllWords;
	}

	public Integer getTotalNumWords() {
		return totalNumWords;
	}

	public Integer getRequestedNumWords() {
		return requestedNumWords;
	}
}
