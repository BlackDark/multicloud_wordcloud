/*
 * GateInitializeModule.java
 *
 */

package de.marbach.bachelor.analysis.gate;

import gate.Gate;
import gate.util.GateException;

import java.io.File;
import java.net.URISyntaxException;
import java.net.URL;

/**
 * Initializes Gate.
 */
public class GateInitializeModule {

  public void init() throws GateException, URISyntaxException {
    if (Gate.isInitialised()) {
      return;
    }

    // Path to the gate_home resource
    URL pathToHome = this.getClass().getResource(NLPConstants.GATE_HOME_DIR);
    File fileToHome = new File("");

    if (pathToHome != null) {
      fileToHome = new File(pathToHome.toURI());
    }

    File pluginsHome =
        new File(fileToHome.getAbsolutePath() + File.separator + "plugins" + File.separator);
    File siteConfig = new File(fileToHome.getAbsolutePath() + File.separator + "gate.xml");

    Gate.setGateHome(fileToHome);
    Gate.setPluginsHome(pluginsHome);
    Gate.setSiteConfigFile(siteConfig);
    Gate.init();
  }
}
