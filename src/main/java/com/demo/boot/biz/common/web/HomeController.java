package com.demo.boot.biz.common.web;

import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class HomeController {

    @GetMapping("/index")
    public String indexView() {
    	return "redirect:/home";
    }
    
    /**
	 * 공통팝업 처리
	 */
    @GetMapping(value = "/popup/{page}")
	public ModelAndView goPopup(@PathVariable("page") String page, @RequestParam Map<String, Object> paramMap) throws Exception {
		ModelAndView mav = new ModelAndView();
		mav.addObject(page, paramMap);
		return mav;
	}
}
