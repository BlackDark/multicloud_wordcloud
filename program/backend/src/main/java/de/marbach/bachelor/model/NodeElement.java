/*
 * NodeElement.java
 *
 */

package de.marbach.bachelor.model;

import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class NodeElement {

	private String text;
	private int freq;
	private int tfidf = 0;
	private Map<Document, Integer> affinityToDocument;

	public NodeElement(String text, int freq) {
		this.text = text;
		this.freq = freq;
		affinityToDocument = new HashMap<>();
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getFreq() {
		return freq;
	}

	public void setFreq(int freq) {
		this.freq = freq;
	}

	public Map<Document, Integer> getAffinityToDocument() {
		return affinityToDocument;
	}

	public void setAffinityToDocument(Map<Document, Integer> affinityToDocument) {
		this.affinityToDocument = affinityToDocument;
	}
}
