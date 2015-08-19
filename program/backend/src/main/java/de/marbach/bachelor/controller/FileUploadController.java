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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 */
@Controller
public class FileUploadController {

	private Map<Integer, AnalysisModule> idToModule = new HashMap<>();
	private int index = 0;
	private Datastore datastore = new Datastore();

	@RequestMapping(value = "/upload", method = RequestMethod.GET)
	public @ResponseBody String provideUploadInfo() {
		return "You can upload documents here.";
	}

	@RequestMapping(value="/upload", method=RequestMethod.POST)
	public @ResponseBody String handleFileUpload(@RequestParam("file") MultipartFile file){
		if (!file.isEmpty()) {
			try {
				byte[] bytes = file.getBytes();
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(datastore.getLocation().resolve(file.getOriginalFilename()))));
				stream.write(bytes);
				stream.close();
				return "You successfully uploaded " + file.getOriginalFilename() + "!";
			} catch (Exception e) {
				return "You failed to upload " + file.getOriginalFilename() + " => " + e.getMessage();
			}
		} else {
			return "You failed to upload " + file.getOriginalFilename() + " because the file was empty.";
		}
	}

	/**
	 * Upload multiple file using Spring Controller
	 */
	@RequestMapping(value = "/uploadMulti", method = RequestMethod.POST)
	public @ResponseBody Integer uploadMultipleFileHandler(@RequestParam("file") MultipartFile[] files) {
		if (files.length == 0) {
			return -3;
		}

		List<File> createdFiles = new ArrayList<>();

		for (int i = 0; i < files.length; i++) {
			MultipartFile file = files[i];
			try {
				byte[] bytes = file.getBytes();

				File serverFile = new File(datastore.getLocation().resolve(file.getOriginalFilename()));
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(serverFile));
				stream.write(bytes);
				stream.close();

				createdFiles.add(serverFile);
			} catch (Exception e) {
				return -2;
			}
		}

		AnalysisModule module = new AnalysisModule();
		idToModule.put(index++, module);
		Runnable thread = () -> module.processFiles(createdFiles);

		thread.run();

		return index - 1;
	}

	@RequestMapping(value="/upload/{uploadId}/progress", method=RequestMethod.GET)
	public @ResponseBody boolean getProgress(@PathVariable Integer uploadId){
		return idToModule.get(uploadId).isFinished();
	}


	@RequestMapping(value="/upload/{uploadId}/result", method=RequestMethod.GET)
	public @ResponseBody
	ResponseWordStorage getProcessedContent(@PathVariable Integer uploadId){
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

		return new ResponseWordStorage(new ResponseInformation("Test"), endNodes, textNodes);
	}

}
