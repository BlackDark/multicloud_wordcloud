/*
 * NodeElement.java
 *
 */

package de.marbach.bachelor.model;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 *
 */
public class NodeElement {

	private String text;
	protected Set<String> tags = new HashSet<>();
	private int tfidf = 0;
	private int freq = 0;
	private Map<Document, Integer> affinityToDocument = new HashMap<>();

	public NodeElement(String text) {
		this.text = text;
	}

	public Set<String> getTags() {
		return tags;
	}

	public NodeElement(String text, int freq) {
		this.text = text;
		this.freq = freq;
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

	public void addFreq(Integer value) {
		freq += value;
	}

	public void addTag(String tag) {
		tags.add(tag);
	}
}
