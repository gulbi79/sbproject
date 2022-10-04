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
    
    @PostMapping("sample1")
    public ApiResponse<?> selectSample1(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(sampleService.selectSample1(params));
    }

    @PostMapping("sample2")
    public ApiResponse<?> selectSample2(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(sampleService.selectSample2(params));
    }

    @PostMapping("sample3")
    public ApiResponse<?> selectSample3(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(sampleService.selectSample3(params));
    }
}
