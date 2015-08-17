/*
 * LuceneWorker.java
 *
 */

package de.marbach.bachelor.analysis;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.queryparser.xml.builders.NumericRangeQueryBuilder;
import org.apache.lucene.search.*;
import org.apache.lucene.search.similarities.DefaultSimilarity;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.RAMDirectory;

import java.io.IOException;

/**
 *
 */
public class LuceneWorker {
	public static void main(String[] args) throws IOException, ParseException {
		// 0. Specify the analyzer for tokenizing text.
		//    The same analyzer should be used for indexing and searching
		StandardAnalyzer analyzer = new StandardAnalyzer();

		// 1. create the index
		Directory index = new RAMDirectory();

		IndexWriterConfig config = new IndexWriterConfig(analyzer);

		IndexWriter w = new IndexWriter(index, config);
		addDoc(w, "Lucene in lucene Action", "193398817");
		addDoc(w, "Lucene for Dummies", "55320055Z");
		addDoc(w, "Managing Gigabytes", "55063554A");
		addDoc(w, "The Art of Computer Science", "9900333X");
		w.close();

		// 2. query
		String querystr = args.length > 0 ? args[0] : "lucene";

		// the "title" arg specifies the default field to use
		// when no field is explicitly specified in the query.
		Query q = new QueryParser("title", analyzer).parse(querystr);

		// 3. search
		int hitsPerPage = 1;
		IndexReader reader = DirectoryReader.open(index);

		IndexSearcher searcher = new IndexSearcher(reader);
		TopScoreDocCollector collector = TopScoreDocCollector.create(hitsPerPage);
		searcher.search(q, collector);
		ScoreDoc[] hits = collector.topDocs().scoreDocs;

		searcher.setSimilarity(new DefaultSimilarity(){
			@Override
			public float tf(float freq) {
				float tf = super.tf(freq);
				System.out.println(tf);
				return tf;
			}
		});
		TermQuery termQuery = new TermQuery(new Term("title", "lucene"));
		System.out.println();
		TopDocs search = searcher.search(termQuery, 5);
		for (ScoreDoc scoreDoc : search.scoreDocs) {
			System.out.println(scoreDoc);
		}

		System.out.println("----");

		// 4. display results
		System.out.println("Found " + hits.length + " hits.");
		for (int i = 0; i < hits.length; ++i) {
			int docId = hits[i].doc;
			Document d = searcher.doc(docId);

			System.out.println((i + 1) + ". " + d.get("isbn") + "\t" + d.get("title"));
		}

		Term term = ((TermQuery) q).getTerm();
		PostingsEnum title = MultiFields.getTermDocsEnum(reader, MultiFields.getLiveDocs(reader), "title", term.bytes());

		// reader can only be closed when there
		// is no need to access the documents any more.
		reader.close();
	}

	private static void addDoc(IndexWriter w, String title, String isbn) throws IOException {
		Document doc = new Document();
		doc.add(new TextField("title", title, Field.Store.YES));

		// use a string field for isbn because we don't want it tokenized
		doc.add(new StringField("isbn", isbn, Field.Store.YES));
		w.addDocument(doc);
	}
}
