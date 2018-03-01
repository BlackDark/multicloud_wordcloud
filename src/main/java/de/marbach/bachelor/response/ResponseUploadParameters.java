package de.marbach.bachelor.response;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/**
 * @author Eduard
 */
public class ResponseUploadParameters {
	private List<String> defaultStopwords;
	private List<String> longStopwords;

	public ResponseUploadParameters() {
		try {
			defaultStopwords = convertFileToStopwordList(getResourceFile("stopwords/default.txt"));
			longStopwords = convertFileToStopwordList(getResourceFile("stopwords/long.txt"));
		} catch (URISyntaxException | FileNotFoundException e) {
			System.err.println("Problems during stop word list generation: " + e.getMessage());
		}
	}

	public List<String> getDefaultStopwords() {
		return defaultStopwords;
	}

	public List<String> getLongStopwords() {
		return longStopwords;
	}

	protected File getResourceFile(String resourcePath) throws URISyntaxException {
		ClassLoader classLoader = getClass().getClassLoader();
		URL resource = classLoader.getResource(resourcePath);

		if (resource == null) {
			return null;
		}

		return new File(resource.toURI().getPath());
	}

	protected List<String> convertFileToStopwordList(File file) throws FileNotFoundException {
		List<String> stopList = new ArrayList<>();

		try (Scanner scanner = new Scanner(file)) {

			while (scanner.hasNextLine()) {
				String line = scanner.nextLine();
				stopList.add(line);
			}

			scanner.close();

		}

		return stopList;
	}
}
