/*
 * LuceneModule.java
 *
 */

package de.marbach.bachelor.analysis;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.index.*;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;
import org.apache.lucene.util.BytesRef;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 *
 */
public class LuceneModule {

	public LuceneModule() {
	}

	public Map<String, Integer> getMapping(File file) throws IOException {
		StandardAnalyzer analyzer = new StandardAnalyzer();
		Directory index = new RAMDirectory();
		IndexWriterConfig config = new IndexWriterConfig(analyzer);
		IndexWriter w = new IndexWriter(index, config);

		addDocument(w, file);

		w.close();

		IndexReader reader = DirectoryReader.open(index);

		Fields termVectors = reader.getTermVectors(0);
		Terms contents = termVectors.terms("contents");

		TermsEnum iterator = contents.iterator();
		BytesRef next = iterator.next();
		TermsEnum test = new SingleTermsEnum(iterator, next);

		Map<String, Integer> mapping = new HashMap<>();

		do {
			Term termInstance = new Term("contents", next);
			long termFreq = reader.totalTermFreq(termInstance);
			long docCount = reader.docFreq(termInstance);

			mapping.put(next.utf8ToString(), (int) termFreq);
			next = iterator.next();
		} while(next != null);

		reader.close();
		index.close();
		return mapping;
	}

	private void addDocument(IndexWriter writer, File file) throws IOException {
		FileReader fr;

		Document doc = new Document();
		fr = new FileReader(file);
		doc.add(new Field("contents", fr, Field.TermVector.YES));
		doc.add(new StringField("path", file.getPath(), Field.Store.YES));
		doc.add(new StringField("filename", file.getName(), Field.Store.YES));
		writer.addDocument(doc);

		fr.close();
	}
}
