/*
 * MergeDocument.java
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
public class MergeDocument extends Document {

	private Map<String, NodeElement> mapping;
	private List<Document> documents;

	public MergeDocument(List<Document> documents) {
		super();
		this.documents = documents;
		mapping = new HashMap<>();

		documents.forEach(this::addDocument);
		this.cleanMapping();
	}

	public void addDocument(Document document) {
		for (NodeElement nodeElement : document.getNodes()) {
			if (!mapping.containsKey(nodeElement.getText())) {
				mapping.put(nodeElement.getText(), nodeElement);
			}
		}
	}

	public List<NodeElement> getTopFrequentMerged(int count) {
		List<NodeElement> sortedList = new ArrayList<>(mapping.values());
		sortedList.sort((o1, o2) -> o2.getFreq() - o1.getFreq());

		int endIndex = count > sortedList.size() ? sortedList.size() : count;
		return sortedList.subList(0, endIndex);
	}

	public Integer getTotalNumWords() {
		return mapping.values().size();
	}

	protected void cleanMapping() {
		removeNodesWithoutIntersections();
		fillEmptyAffinities();
	}

	protected void fillEmptyAffinities() {
		for (NodeElement nodeElement : mapping.values()) {
			documents.stream().filter(document -> !nodeElement.getAffinityToDocument().containsKey(document)).forEach(document -> {
				nodeElement.getAffinityToDocument().put(document, 0);
			});
		}
	}

	protected void removeNodesWithoutIntersections() {
		List<String> valuesToRemove = new ArrayList<>();

		for (NodeElement nodeElement : mapping.values()) {
			if (nodeElement.getAffinityToDocument().keySet().size() <= 1) {
				valuesToRemove.add(nodeElement.getText());
				nodeElement.getAffinityToDocument().keySet().iterator().next().addUniqueNode(nodeElement);
			}
		}

		valuesToRemove.forEach(mapping::remove);
	}
}
