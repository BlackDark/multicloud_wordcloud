package de.marbach.bachelor.response;

import java.io.File;
import java.io.IOException;
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
		defaultStopwords = convertFileToStopwordList(getResourceFile("stopwords/default.txt"));
		longStopwords = convertFileToStopwordList(getResourceFile("stopwords/long.txt"));
	}

	public List<String> getDefaultStopwords() {
		return defaultStopwords;
	}

	public List<String> getLongStopwords() {
		return longStopwords;
	}

	protected File getResourceFile(String resourcePath) {
		ClassLoader classLoader = getClass().getClassLoader();
		URL resource = classLoader.getResource(resourcePath);

		if (resource == null) {
			return null;
		}

		return new File(resource.getFile());
	}

	protected List<String> convertFileToStopwordList(File file) {
		List<String> stopList = new ArrayList<>();

		try (Scanner scanner = new Scanner(file)) {

			while (scanner.hasNextLine()) {
				String line = scanner.nextLine();
				stopList.add(line);
			}

			scanner.close();

		} catch (IOException e) {
			System.err.println("Problems during stop word list generation.");
		}

		return stopList;
	}
}
