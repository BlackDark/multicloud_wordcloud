package de.marbach.bachelor.analysis.gate;

/**
 * Implements a NLP Result for {@link AbstractNLPModule}. Can be used for Annie NLP, Stanford NLP and Open NLP.
 */
public abstract class AbstractNLPResult implements AutoCloseable {
  private boolean isCleanedUp;

  /**
   * Builds a new NLP Result.
   *
   */
  public AbstractNLPResult() {
  }

  @Override
  public void close() throws Exception {
    if (isCleanedUp) {
      return;
    }

    isCleanedUp = true;
  }
}
