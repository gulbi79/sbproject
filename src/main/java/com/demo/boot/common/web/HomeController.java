package com.demo.boot.common.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class HomeController {

    @GetMapping("/index")
    public String indexView() {
    	return "redirect:/home";
    }
}
