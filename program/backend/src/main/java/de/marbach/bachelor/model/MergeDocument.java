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
		super(new ArrayList<>(), 0);
		this.documents = documents;
		mapping = new HashMap<>();

		documents.forEach(this::addDocument);
		this.cleanMapping();
	}

	private void cleanMapping() {
		List<String> valuesToRemove = new ArrayList<>();

		for (NodeElement nodeElement : mapping.values()) {
			if (nodeElement.getAffinityToDocument().keySet().size() <= 1) {
				valuesToRemove.add(nodeElement.getText());
			} else {
				for (Document document : nodeElement.getAffinityToDocument().keySet()) {
					document.removeUniqueNode(nodeElement.getText());
				}
			}
		}

		valuesToRemove.forEach(mapping::remove);
	}

	public void addDocument(Document document) {
		for (NodeElement nodeElement : document.getNodes()) {
			this.addNode(document, nodeElement);
		}
	}

	public void addNode(Document document, NodeElement element) {
		if (!mapping.containsKey(element.getText())) {
			mapping.put(element.getText(), new NodeElement(element.getText(), 0));
		}

		NodeElement nodeElement = mapping.get(element.getText());
		nodeElement.setFreq(nodeElement.getFreq() + element.getFreq());
		nodeElement.getAffinityToDocument().put(document, element.getFreq());
	}

	public List<NodeElement> getTopFrequentMerged(int count) {
		List<NodeElement> sortedList = new ArrayList<>(mapping.values());
		sortedList.sort((o1, o2) -> o2.getFreq() - o1.getFreq());

		int endIndex = count > sortedList.size() ? sortedList.size() : count;
		return sortedList.subList(0, endIndex);
	}
}
