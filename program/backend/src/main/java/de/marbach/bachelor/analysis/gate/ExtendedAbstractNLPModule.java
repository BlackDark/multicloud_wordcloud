package de.marbach.bachelor.analysis.gate;

import gate.Gate;
import gate.creole.ConditionalSerialAnalyserController;
import gate.util.GateException;
import gate.util.persistence.PersistenceManager;

import java.io.File;
import java.io.IOException;

/**
 * An extended version of the {@link AbstractNLPModule} with additional implementations. Can be
 * overwritten if needed.
 */
public abstract class ExtendedAbstractNLPModule extends AbstractNLPModule {

  private String pluginDir;
  private String defaultFile;

  /**
   * Initializes a new AbstractExtendedNLPModule.
   * 
   * @param pluginDir - The directory of the plugin.
   * @param defaultFile - The default .(x)gapp file.
   */
  public ExtendedAbstractNLPModule(String pluginDir, String defaultFile) {
    this.pluginDir = pluginDir;
    this.defaultFile = defaultFile;
  }

  @Override
  protected void loadEngine() throws GateException, IOException {
    if (controller != null) {
      return;
    }

    File pluginsHome = Gate.getPluginsHome();
    File engineFolder = new File(pluginsHome, pluginDir);
    File engineState = new File(engineFolder, defaultFile);
    Gate.getCreoleRegister().registerDirectories(engineFolder.toURI().toURL());

    controller =
        (ConditionalSerialAnalyserController) PersistenceManager.loadObjectFromFile(engineState);
  }

}
