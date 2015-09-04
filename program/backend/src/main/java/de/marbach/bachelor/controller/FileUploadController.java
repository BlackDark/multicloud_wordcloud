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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

/**
 *
 */
@Controller
public class FileUploadController {

	private Map<Integer, AnalysisModule> idToModule = new HashMap<>();
	private int index = 0;
	private Datastore datastore = new Datastore();

	@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Parameter not correct")
	@ExceptionHandler(IllegalArgumentException.class)
	public void parameterException(Exception e) {
		System.out.println("--- Parameter exception: " + e.getMessage());
	}

	@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "No module found for id")
	@ExceptionHandler(IllegalAccessError.class)
	public void noModuleFound(Exception e) {
		System.out.println("--- No module found for requested id: " + e.getMessage());
	}

	/**
	 * Upload multiple file using Spring Controller
	 */
	@ResponseBody
	@RequestMapping(value = "/uploadMulti", method = RequestMethod.POST)
	public Integer uploadMultipleFileHandler(@RequestParam("file") MultipartFile[] files) throws IOException {
		if (files == null || files.length == 0) {
			throw new IllegalArgumentException();
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
				throw new IOException();
			}
		}

		AnalysisModule module = new AnalysisModule();
		idToModule.put(index++, module);
		Runnable thread = () -> module.processFiles(createdFiles);

		thread.run();

		return index - 1;
	}

	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	@RequestMapping(value = "/upload/{uploadId}/progress", method = RequestMethod.GET)
	public Boolean getProgress(@PathVariable Integer uploadId) {
		if (uploadId == null) {
			throw new IllegalArgumentException("Upload ID is null");
		}

		if (!idToModule.containsKey(uploadId)) {
			throw new IllegalAccessError(uploadId.toString());
		}

		return idToModule.get(uploadId).isFinished();
	}

	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	@RequestMapping(value = "/upload/{uploadId}/result", method = RequestMethod.GET)
	public ResponseWordStorage getProcessedContent(@PathVariable Integer uploadId) {
		if (uploadId == null) {
			throw new IllegalArgumentException("Upload ID is null");
		}

		if (!idToModule.containsKey(uploadId)) {
			throw new IllegalAccessError(uploadId.toString());
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

		return new ResponseWordStorage(new ResponseInformation("Test", 200, 3000), endNodes, textNodes);
	}

	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	@RequestMapping(value = "/upload/availableResources", method = RequestMethod.GET)
	public List<ResponseFinishedDocuments> getAllProcessed() {
		List<ResponseFinishedDocuments> documentsList = new ArrayList<>();

		for (Map.Entry<Integer, AnalysisModule> entry : idToModule.entrySet()) {
			documentsList.add(new ResponseFinishedDocuments(entry.getValue().getFileNames(), entry.getKey(), entry.getValue().isFinished()));
		}

		return documentsList;
	}

}
