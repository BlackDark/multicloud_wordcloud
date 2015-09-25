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
	private List<NodeElement> uniqueNodes = new ArrayList<>();
	private int id = 0;
	private int wordCount;

	public Document(String title, List<NodeElement> nodes, int wordCount) {
		this.title = title;
		this.nodes = nodes;
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

	public void addUniqueNode(NodeElement textNode) {
		uniqueNodes.add(textNode);
	}

	public List<NodeElement> getTopFrequentUniqueNodes(int num) {
		uniqueNodes.sort((o1, o2) -> o2.getFreq() - o1.getFreq());

		int endIndex = num > uniqueNodes.size() ? uniqueNodes.size() : num;
		return uniqueNodes.subList(0, endIndex);
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
