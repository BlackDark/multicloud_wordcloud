/*
 * FileUploadController.java
 *
 */

package de.marbach.bachelor.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.marbach.bachelor.analysis.AnalysisModule;
import de.marbach.bachelor.model.*;
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
import java.util.stream.Collectors;

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
	public Integer uploadMultipleFileHandler(@RequestParam("file") MultipartFile[] files, @RequestParam("parameters") String parameters) throws IOException {
		if (files == null || files.length == 0) {
			throw new IllegalArgumentException();
		}

		ObjectMapper mapper = new ObjectMapper();
		AnalysisParameters params;

		try {
			params = mapper.readValue(parameters, AnalysisParameters.class);
		} catch (IOException e) {
			params = new AnalysisParameters();
		}

		List<File> createdFiles = new ArrayList<>();

		for (int i = 0; i < files.length; i++) {
			MultipartFile file = files[i];
			try {
				byte[] bytes = file.getBytes();
				String fileName = file.getOriginalFilename().isEmpty() ? UUID.randomUUID().toString() : file.getOriginalFilename();
				File serverFile = new File(datastore.getLocation().resolve(fileName.replace(" ", "%20")));
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				createdFiles.add(serverFile);
			} catch (Exception e) {
				e.printStackTrace();
				throw new IOException();
			}
		}

		AnalysisModule module = new AnalysisModule(params);
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
	@RequestMapping(value = "/upload/{uploadId}/numWords", method = RequestMethod.POST)
	public ResponseWordStorage getNumWords(@PathVariable Integer uploadId, @RequestParam("numWords") Integer numWords, @RequestParam("numDocumentWords") Integer numDocumentWords) {
		if (uploadId == null || numWords == null || numDocumentWords == null) {
			throw new IllegalArgumentException("Null value for parameter");
		}

		if (!idToModule.containsKey(uploadId)) {
			throw new IllegalAccessError(uploadId.toString());
		}

		List<Document> documents = idToModule.get(uploadId).getDocuments();
		MergeDocument mergedDocument = idToModule.get(uploadId).getMergedDocument();

		List<ResponseEndNode> endNodes = new ArrayList<>();
		endNodes.addAll(documents.stream().map(document -> new ResponseEndNode(document.getTitle(), document.getId(), createNodeList(document.getTopFrequentUniqueNodes(numDocumentWords)), document.getWordCount())).collect(Collectors.toList()));


		List<ResponseTextNode> textNodes = new ArrayList<>();
		List<NodeElement> topFrequentMerged = mergedDocument.getTopFrequentMerged(numWords);
		textNodes.addAll(createNodeList(topFrequentMerged));

		return new ResponseWordStorage(new ResponseInformation(topFrequentMerged.size(), mergedDocument.getTotalNumWords(), documents.stream().mapToInt(Document::getWordCount).sum()), endNodes, textNodes);
	}

	protected List<ResponseTextNode> createNodeList(Collection<NodeElement> elements) {
		return elements.stream().map(this::createNode).collect(Collectors.toList());
	}

	protected ResponseTextNode createNode(NodeElement element) {
		return new ResponseTextNode(element.getText(), element.getFreq(), createConnections(element), element.getTags());
	}

	protected List<ResponseDocumentConnection> createConnections(NodeElement element) {
		return element.getAffinityToDocument().entrySet().stream().map(documentIntegerEntry -> new ResponseDocumentConnection(documentIntegerEntry.getKey().getId(), documentIntegerEntry.getValue())).collect(Collectors.toList());
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

	@ResponseBody
	@ResponseStatus(HttpStatus.OK)
	@RequestMapping(value = "/upload/parameters", method = RequestMethod.GET)
	public ResponseUploadParameters getUploadParameters() {
		return new ResponseUploadParameters();
	}
}
