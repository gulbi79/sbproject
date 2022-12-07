package com.demo.boot.biz2.sample.web;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.boot.biz2.sample.service.SampleService;
import com.demo.boot.utils.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/sampleSub")
@RequiredArgsConstructor
public class SampleController {

    private final SampleService sampleService;
    
    @PostMapping("sample1")
    public ApiResponse<?> selectSample1(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(sampleService.selectSample1(params));
    }
}
