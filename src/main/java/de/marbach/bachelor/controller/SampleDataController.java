/*
 * SampleDataController.java
 *
 */

package de.marbach.bachelor.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 */
@Controller
public class SampleDataController {

	@RequestMapping(value="/sample/data", method= RequestMethod.GET)
	public @ResponseBody String getSampleData(){
		// TODO

		return null;
	}
}