/*
 * Datastore.java
 *
 */

package de.marbach.bachelor.model;

import java.io.File;
import java.net.URI;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 *
 */
public class Datastore {

	private static final String MULTICLOUD_DIR = ".multicloud";
	private static final String TMP_FILE_STORE = "tmpFiles";
	private static final String MICROSOFT_AZURE_VARIABLE_HOME = "HOME";

	private String homeDir = System.getProperty("user.home");
	private URI location;
	/**
	 * Creates a new instance of Datastore, holding to the default directory.
	 */
	public Datastore() {
		Path datastore = Paths.get(homeDir).resolve(MULTICLOUD_DIR).resolve(TMP_FILE_STORE);
		location = datastore.toUri();
		recursivelyCreateFolders();
	}

	/**
	 * Creates a new instance of Datastore, holding the given URI.
	 *
	 * @param location - the URI where GATE should store its data
	 */
	public Datastore(URI location) {
		this.location = location;
		recursivelyCreateFolders();
	}

	public Datastore(String subLocation) {
		Path datastore = Paths.get(homeDir).resolve(MULTICLOUD_DIR).resolve(subLocation);
		location = datastore.toUri();
		recursivelyCreateFolders();
	}

	protected void recursivelyCreateFolders() {
		URI azureUri = getAzureUri();

		if(azureUri != null) {
			setLocation(azureUri);
		}

		File folder = new File(location);


		if(!folder.exists() && !folder.mkdirs()) {
			throw new IllegalStateException("Couldn't create the necessary directories!");
		}
	}

	/**
	 * Work around for Microsoft Azure web apps
	 * @return A compatible azure uri which has write access.
	 */
	private URI getAzureUri() {
		String azureHome = System.getenv(MICROSOFT_AZURE_VARIABLE_HOME);

		if(azureHome == null) {
			return null;
		}

		Path tmpDirectory = Paths.get(azureHome).resolve(MULTICLOUD_DIR).resolve(TMP_FILE_STORE);
		return tmpDirectory.toUri();
	}

	/**
	 * @return the location as URI
	 */
	public URI getLocation() {
		return location;
	}

	/**
	 * Sets the location to the given URI.
	 *
	 * @param location - the URI where the uploaded files should be stored.
	 */
	public void setLocation(URI location) {
		this.location = location;
	}
}
