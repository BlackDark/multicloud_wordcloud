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

	private final Boolean isFinished;

	public ResponseFinishedDocuments(List<String> fileNames, Integer id, Boolean isFinished) {

		this.fileNames = fileNames;
		this.id = id;
		this.isFinished = isFinished;
	}

	public Boolean getIsFinished() {
		return isFinished;
	}

	public List<String> getFileNames() {
		return fileNames;
	}

	public Integer getId() {
		return id;
	}


}
