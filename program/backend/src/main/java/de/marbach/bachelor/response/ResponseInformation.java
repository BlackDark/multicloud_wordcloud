/*
 * ResponseInformation.java
 *
 */

package de.marbach.bachelor.response;

/**
 *
 */
public class ResponseInformation {
	private final String test;
	private final Integer requestedNumWords;
	private final Integer totalNumWords;

	public ResponseInformation(String test, Integer requestedNumWords, Integer totalNumWords) {
		this.test = test;
		this.requestedNumWords = requestedNumWords;
		this.totalNumWords = totalNumWords;
	}

	public Integer getTotalNumWords() {
		return totalNumWords;
	}

	public Integer getRequestedNumWords() {
		return requestedNumWords;
	}

	public String getTest() {
		return test;
	}
}
