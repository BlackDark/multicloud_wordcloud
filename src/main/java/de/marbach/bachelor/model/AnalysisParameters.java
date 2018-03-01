package de.marbach.bachelor.model;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Eduard
 */
public class AnalysisParameters {
	private List<String> stopwords = new ArrayList<>();

	public AnalysisParameters() {
	}

	public List<String> getStopwords() {
		return stopwords;
	}

	public void setStopwords(List<String> stopwords) {
		this.stopwords = stopwords;
	}
}
