/*
 * Document.java
 *
 */

package de.marbach.bachelor.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
public class Document {

	private String title;
	private List<NodeElement> nodes = new ArrayList<>();
	private List<NodeElement> uniqueNodes = new ArrayList<>();
	private Map<NodeElement, Integer> nodeToFreq = new HashMap<>();
	private int id = 0;
	private int wordCount = 0;

	public Document() {

	}

	public Document(String title, List<NodeElement> nodes, int wordCount) {
		this.title = title;
		this.nodes = nodes;
		this.wordCount = wordCount;
	}

	public List<NodeElement> getNodes() {
		return new ArrayList<>(nodeToFreq.keySet());
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

	public void setTitle(String title) {
		this.title = title;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Map<NodeElement, Integer> getNodeToFreq() {
		return nodeToFreq;
	}

	public void calculateWordCount() {
		this.wordCount = nodeToFreq.values().stream().mapToInt(Integer::intValue).sum();
	}

	public void addNode(NodeElement nodeElement, Integer freq) {
		nodeToFreq.put(nodeElement, freq);
	}
}
