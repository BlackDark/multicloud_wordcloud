/*
 * FileUploadController.java
 *
 */

package de.marbach.bachelor.controller;

import de.marbach.bachelor.analysis.AnalysisModule;
import de.marbach.bachelor.model.Datastore;
import de.marbach.bachelor.model.Document;
import de.marbach.bachelor.model.MergeDocument;
import de.marbach.bachelor.model.NodeElement;
import de.marbach.bachelor.response.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.*;

/**
 *
 */
@Controller
public class FileUploadController {

	private Map<Integer, AnalysisModule> idToModule = new HashMap<>();
	private int index = 0;
	private Datastore datastore = new Datastore();

	/**
	 * Upload multiple file using Spring Controller
	 */
	@RequestMapping(value = "/uploadMulti", method = RequestMethod.POST)
	public @ResponseBody
	ResponseEntity<Integer> uploadMultipleFileHandler(@RequestParam("file") MultipartFile[] files) {
		if (files == null || files.length == 0) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		List<File> createdFiles = new ArrayList<>();

		for (int i = 0; i < files.length; i++) {
			MultipartFile file = files[i];
			try {
				byte[] bytes = file.getBytes();

				String fileName = file.getOriginalFilename().isEmpty() ? UUID.randomUUID().toString() : file.getOriginalFilename();

				File serverFile = new File(datastore.getLocation().resolve(fileName));
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				createdFiles.add(serverFile);
			} catch (Exception e) {
				e.printStackTrace();
				return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}

		AnalysisModule module = new AnalysisModule();
		idToModule.put(index++, module);
		Runnable thread = () -> module.processFiles(createdFiles);

		thread.run();

		return new ResponseEntity<>(index - 1, HttpStatus.PROCESSING);
	}

	@RequestMapping(value = "/upload/{uploadId}/progress", method = RequestMethod.GET)
	public
	@ResponseBody
	ResponseEntity<Boolean> getProgress(@PathVariable Integer uploadId) {
		if (uploadId == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		if (!idToModule.containsKey(uploadId)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		return new ResponseEntity<>(idToModule.get(uploadId).isFinished(), HttpStatus.OK);
	}

	@RequestMapping(value = "/upload/{uploadId}/result", method = RequestMethod.GET)
	public
	@ResponseBody
	ResponseEntity<ResponseWordStorage> getProcessedContent(@PathVariable Integer uploadId) {
		if (uploadId == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		if (!idToModule.containsKey(uploadId)) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}

		List<Document> documents = idToModule.get(uploadId).getDocuments();
		MergeDocument mergedDocument = idToModule.get(uploadId).getMergedDocument();


		List<ResponseEndNode> endNodes = new ArrayList<>();
		List<ResponseTextNode> textNodes = new ArrayList<>();

		for (int i = 0; i < documents.size(); i++) {
			endNodes.add(new ResponseEndNode("" + i));
		}

		for (NodeElement nodeElement : mergedDocument.getTopFrequentMerged(200)) {
			textNodes.add(new ResponseTextNode(nodeElement.getText(), nodeElement.getFreq(), new ArrayList<>(nodeElement.getAffinityToDocument().values())));
		}

		return new ResponseEntity<>(new ResponseWordStorage(new ResponseInformation("Test"), endNodes, textNodes), HttpStatus.OK);
	}

	@RequestMapping(value = "/upload/availableResources", method = RequestMethod.GET)
	public
	@ResponseBody
	List<ResponseFinishedDocuments> getAllProcessed() {
		List<ResponseFinishedDocuments> documentsList = new ArrayList<>();

		for (Map.Entry<Integer, AnalysisModule> entry : idToModule.entrySet()) {
			documentsList.add(new ResponseFinishedDocuments(entry.getValue().getFileNames(), entry.getKey()));
		}

		return documentsList;
	}

}
