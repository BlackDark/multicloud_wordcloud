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

	private String title;
	private List<NodeElement> nodes;
	private List<NodeElement> uniqueNodes;
	private int id = 0;
	private int wordCount;

	public Document(String title, List<NodeElement> nodes, int wordCount) {
		this.title = title;
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

	public String getTitle() {
		return title;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
