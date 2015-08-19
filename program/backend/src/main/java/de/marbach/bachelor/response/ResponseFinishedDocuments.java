/*
 * ResponseFinishedDocuments.java
 *
 */

package de.marbach.bachelor.response;

import java.util.List;

/**
 *
 */
public class ResponseFinishedDocuments {

	private final List<String> fileNames;
	private final Integer id;

	public ResponseFinishedDocuments(List<String> fileNames, Integer id) {

		this.fileNames = fileNames;
		this.id = id;
	}

	public List<String> getFileNames() {
		return fileNames;
	}

	public Integer getId() {
		return id;
	}


}
