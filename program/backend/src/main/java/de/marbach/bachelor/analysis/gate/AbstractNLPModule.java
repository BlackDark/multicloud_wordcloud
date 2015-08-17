/*
 * AbstractNLPModule.java
 *
 */

package de.marbach.bachelor.analysis.gate;

import gate.*;
import gate.creole.ANNIEConstants;
import gate.creole.ConditionalSerialAnalyserController;
import gate.creole.ExecutionException;
import gate.creole.ResourceInstantiationException;
import gate.util.GateException;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.util.HashSet;
import java.util.Set;

/**
 * Abstract module for NLP tools. Implements the most common needed methods for the analysis.
 * Can be overwritten if needed.
 */
public abstract class AbstractNLPModule {

	private static final String CORPUS_NAME = "ViTA Corpus";
	protected ConditionalSerialAnalyserController controller;
	protected Corpus corpus;

	public void execute()
			throws Exception {

		// Persist the analysis into the datastore with the document id
		if (corpus == null) {
			loadEngine();
			createCorpus();
			startAnalysis();
		}

		createResultMap();
	}

	/**
	 * Creates the Gate corpus out of the available chapters.
	 */
	protected void createCorpus() throws ResourceInstantiationException, MalformedURLException {
		corpus = Factory.newCorpus(CORPUS_NAME);

		Document doc = Factory.newDocument(new File("C:/Users/Eduard/Documents/git_repos/bachelor/repo/program/web/text/test1.txt").toURI().toURL());

		corpus.add(doc);
	}

	/**
	 * Creates the result mapping.
	 */
	protected void createResultMap() {

		for (Object docObj : corpus) {
			Document doc = (Document) docObj;
			AnnotationSet defaultAnnotSet = doc.getAnnotations();
			Set<String> annotTypesRequired = new HashSet<>();
			annotTypesRequired.add(ANNIEConstants.PERSON_ANNOTATION_TYPE);
			annotTypesRequired.add(ANNIEConstants.LOCATION_ANNOTATION_TYPE);
			Set<Annotation> peopleAndPlaces = new HashSet<>(defaultAnnotSet.get(annotTypesRequired));
		}
	}

	/**
	 * Starts the analysis with the initialized controller.
	 *
	 * @throws ExecutionException If an exception occurs during execution of the controller or the controller gets interrupted.
	 */
	protected void startAnalysis() throws InterruptedException, ExecutionException {
		controller.setCorpus(corpus);

		int maxDocuments = corpus.size();

		controller.execute();
		System.out.println("FINISHED");
		createResultMap();
	}

	protected abstract void loadEngine() throws GateException, IOException;
}
