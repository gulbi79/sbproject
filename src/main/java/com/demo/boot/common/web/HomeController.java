package com.demo.boot.common.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class HomeController {

    @GetMapping("/")
    public String homeView() {
        return "home";
    }

    @GetMapping("/index")
    public String indexView() {
        return "index";
    }

    @GetMapping("/top")
    public String topView() {
        return "top";
    }

    @GetMapping("/inner")
    public String innerView() {
        return "inner";
    }

    @GetMapping("/board/list")
    public String boardListView() {
        return "board/list";
    }
}
