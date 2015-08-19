/*
 * AnalysisModule.java
 *
 */

package de.marbach.bachelor.analysis;

import de.marbach.bachelor.model.Document;
import de.marbach.bachelor.model.MergeDocument;
import de.marbach.bachelor.model.NodeElement;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 *
 */
public class AnalysisModule {

	private List<File> files;
	private List<Document> documents;
	private MergeDocument mergedDocument;
	private boolean isFinished;
	private List<String> fileNames;

	public AnalysisModule() {
		documents = new ArrayList<>();
		isFinished = false;
	}

	public static void main(String[] args) {
		File file1 = new File("C:/Users/Eduard/Documents/git_repos/bachelor/repo/program/web/text/text1.txt");
		File file2 = new File("C:/Users/Eduard/Documents/git_repos/bachelor/repo/program/web/text/text2.txt");
		File file3 = new File("C:/Users/Eduard/Documents/git_repos/bachelor/repo/program/web/text/text3.txt");
		File file4 = new File("C:/Users/Eduard/Documents/git_repos/bachelor/repo/program/web/text/text4.txt");

		AnalysisModule analysisModule = new AnalysisModule();
		analysisModule.processFiles(Arrays.asList(file1, file2, file3, file4));
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
		LuceneModule module = new LuceneModule();
		this.files = files;

		for (File file : files) {
			Map<String, Integer> mapping = null;
			try {
				mapping = module.getMapping(file);
			} catch (IOException e) {
				e.printStackTrace();
			}
			documents.add(generateDocument(mapping));
		}

		mergedDocument = new MergeDocument(documents);

		finishProcess();
	}

	private void finishProcess() {
		isFinished = true;

		fileNames = new ArrayList<>();
		files.forEach(file -> fileNames.add(file.getName()));
		files.forEach(File::delete);
	}

	protected Document generateDocument(Map<String, Integer> mapping) {
		List<NodeElement> nodes = mapping.entrySet().stream().map(stringIntegerEntry -> new NodeElement(stringIntegerEntry.getKey(), stringIntegerEntry.getValue())).collect(Collectors.toList());
		int wordCount = 0;

		for (NodeElement node : nodes) {
			wordCount += node.getFreq();
		}

		return new Document(nodes, wordCount);
	}

	public boolean isFinished() {
		return isFinished;
	}
}
