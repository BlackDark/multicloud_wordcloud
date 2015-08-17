/*
 * ANNIEModule.java
 *
 */

package de.marbach.bachelor.analysis.gate;

/**
 * Gate ANNIE module which searches for persons and locations.
 */
public class ANNIEModule extends ExtendedAbstractNLPModule {

  /**
   * Initialize a new ANNIEModule.
   */
  public ANNIEModule() {
    super(NLPConstants.ANNIE_NLP_PLUGIN_DIR, NLPConstants.ANNIE_NLP_DEFAULT_FILE);
  }
}
