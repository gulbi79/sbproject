package com.demo.boot.biz.web;

import com.demo.boot.biz.service.TestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TestRestController {

    private final TestService testService;

    @GetMapping("test1")
    public ResponseEntity<?> getRoleList() {
        return ResponseEntity.ok().body(testService.getRoleList());
    }
}
