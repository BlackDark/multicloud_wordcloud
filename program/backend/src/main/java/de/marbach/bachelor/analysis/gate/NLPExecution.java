/*
 * NLPExecution.java
 *
 */

package de.marbach.bachelor.analysis.gate;

/**
 *
 */
public class NLPExecution {
	public static void main(String[] args) {
		NLPExecution test = new NLPExecution();
		try {
			test.execute();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	public NLPExecution() {

	}

	public void execute() throws Exception {
		GateInitializeModule gateInitializeModule = new GateInitializeModule();
		gateInitializeModule.init();

		StanfordNLPModule module = new StanfordNLPModule();
		module.execute();
	}

	public void getResult() {

	}
}
