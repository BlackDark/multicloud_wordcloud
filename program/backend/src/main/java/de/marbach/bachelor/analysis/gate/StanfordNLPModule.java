/*
 * StanfordNLPModule.java
 *
 */

package de.marbach.bachelor.analysis.gate;

import gate.Annotation;
import gate.AnnotationSet;
import gate.Document;
import gate.DocumentContent;
import gate.util.InvalidOffsetException;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * StanfordCoreNLP module to analyze the text.
 */
public class StanfordNLPModule extends ExtendedAbstractNLPModule {

  /**
   * Initialize a new StanfordNLPModule.
   */
  public StanfordNLPModule() {
    super(NLPConstants.STANFORD_NLP_PLUGIN_DIR, NLPConstants.STANFORD_NLP_DEFAULT_FILE);
  }


  /**
   * Need to be overridden because stanford has slightly different annotation types for persons and
   * locations.
   */
  @Override
  protected void createResultMap() {
    for (Object docObj : corpus) {
      Document doc = (Document) docObj;
      AnnotationSet defaultAnnotSet = doc.getAnnotations();
      Set<String> annotTypesRequired = new HashSet<>();
      annotTypesRequired.add(NLPConstants.TYPE_PERSON_STANFORD);
      annotTypesRequired.add(NLPConstants.TYPE_LOCATION_STANFORD);
      Set<Annotation> peopleAndPlaces = new HashSet<>(defaultAnnotSet.get(annotTypesRequired));

      Set<String> test = new HashSet<>();
      test.add("Split");
      Set<Annotation> testA = new HashSet<>(defaultAnnotSet.get(annotTypesRequired));
      Set<Annotation> better = new HashSet<>();

      Map<String, Integer> frequency = new HashMap<>();

      for (Annotation annotation : testA) {
        if (annotation.getEndNode().getOffset() - annotation.getStartNode().getOffset() > 1) {
          better.add(annotation);
          try {
            DocumentContent word = doc.getContent().getContent(annotation.getStartNode().getOffset(), annotation.getEndNode().getOffset());

            if(frequency.containsKey(word.toString())) {
              Integer integer = frequency.get(word.toString());
              frequency.put(word.toString(), ++integer);
            } else {
              frequency.put(word.toString(), 1);
            }
          } catch (InvalidOffsetException e) {
            e.printStackTrace();
          }
        }
      }

      frequency.entrySet().forEach(System.out::println);
      System.out.println();
    }
  }
  
}
