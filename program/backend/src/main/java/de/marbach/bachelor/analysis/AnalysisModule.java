/*
 * AnalysisModule.java
 *
 */

package de.marbach.bachelor.analysis;

import de.marbach.bachelor.model.AnalysisParameters;
import de.marbach.bachelor.model.Document;
import de.marbach.bachelor.model.MergeDocument;
import de.marbach.bachelor.model.NodeElement;

import java.io.File;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

/**
 *
 */
public class AnalysisModule {

	private final AnalysisParameters params;
	private List<File> files;
	private List<Document> documents;
	private MergeDocument mergedDocument;
	private boolean isFinished;
	private List<String> fileNames;
	public Map<String, NodeElement> allNodes = new HashMap<>();

	public AnalysisModule(AnalysisParameters params) {
		this.params = params;
		documents = new ArrayList<>();
		isFinished = false;
	}

	public static void main(String[] args) {
		File file1 = new File("D:/bachelor/text/text5.txt");
		File file2 = new File("D:/bachelor/text/text6.txt");
		File file3 = new File("D:/bachelor/text/text7.txt");
		File file4 = new File("D:/bachelor/text/text8.txt");

		AnalysisModule analysisModule = new AnalysisModule(new AnalysisParameters());
		analysisModule.processFiles(Arrays.asList(file1, file2, file3, file4));
		ArrayList<String> strings = new ArrayList<>(analysisModule.allNodes.keySet());
		Collections.sort(strings);
		List<String> nn = analysisModule.allNodes.values().stream().filter(nodeElement -> nodeElement.getTags().contains("NN")).map(NodeElement::getText).collect(Collectors.toList());
		//System.out.println(nn);
		System.out.println(analysisModule.getMergedDocument().getTotalNumWords());
	}

	public List<String> getFileNames() {
		return fileNames;
	}

	public List<File> getFiles() {
		return files;
	}

	public List<Document> getDocuments() {
		return documents;
	}

	public MergeDocument getMergedDocument() {
		return mergedDocument;
	}

	public void processFiles(List<File> files) {
		LuceneModule module = new LuceneModule(params);
		this.files = files;

		for (int i = 0; i < files.size(); i++) {
			File file = files.get(i);
			try {
				documents.add(generateDocument(file, module.getMapping(file), i));
				StanfordTagger tagger = new StanfordTagger();
				tagger.annotate(file, allNodes);
			} catch (IOException e) {
				throw new IllegalStateException("Problems during parsing of file.");
			}
		}


		mergedDocument = new MergeDocument(documents);

		//finishProcess();
	}

	private void finishProcess() {
		isFinished = true;

		fileNames = new ArrayList<>();
		files.forEach(file -> fileNames.add(file.getName()));
		files.forEach(File::delete);
	}

	protected Document generateDocument(File file, Map<String, Integer> mapping, int documentId) {
		Document documentTest = new Document();
		documentTest.setId(documentId);
		documentTest.setTitle(file.getName());

		for (Map.Entry<String, Integer> stringIntegerEntry : mapping.entrySet()) {
			if (!allNodes.containsKey(stringIntegerEntry.getKey())) {
				allNodes.put(stringIntegerEntry.getKey(), new NodeElement(stringIntegerEntry.getKey()));
			}

			NodeElement nodeElement = allNodes.get(stringIntegerEntry.getKey());
			nodeElement.addFreq(stringIntegerEntry.getValue());
			nodeElement.getAffinityToDocument().put(documentTest, stringIntegerEntry.getValue());
			documentTest.addNode(nodeElement, stringIntegerEntry.getValue());
		}

		documentTest.calculateWordCount();

		return documentTest;
	}

	public boolean isFinished() {
		return isFinished;
	}
}
