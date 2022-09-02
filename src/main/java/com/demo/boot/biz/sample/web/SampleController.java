package com.demo.boot.biz.sample.web;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.boot.biz.sample.service.SampleService;
import com.demo.boot.utils.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/sample")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;
    
    @PostMapping("samplemain")
    public ApiResponse<?> selectMenu(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(sampleService.selectMain(params));
    }
}
