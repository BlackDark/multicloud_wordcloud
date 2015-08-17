/*
 * Document.java
 *
 */

package de.marbach.bachelor.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 */
public class Document {

	private List<NodeElement> nodes;
	private List<NodeElement> uniqueNodes;
	private int wordCount;

	public Document(List<NodeElement> nodes, int wordCount) {
		this.nodes = nodes;
		this.uniqueNodes = new ArrayList<>(nodes);
		this.wordCount = wordCount;
	}

	public int getWordCount() {
		return wordCount;
	}

	public List<NodeElement> getNodes() {
		return nodes;
	}

	public List<NodeElement> getTopFrequentWords(int numberOfElements) {
		nodes.sort((o1, o2) -> o2.getFreq() - o1.getFreq());

		return nodes.subList(0, numberOfElements);
	}

	public List<NodeElement> getUniqueNodes() {
		return uniqueNodes;
	}

	public void removeUniqueNode(String text) {

	}
}