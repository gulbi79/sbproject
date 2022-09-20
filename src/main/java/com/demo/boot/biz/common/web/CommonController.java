package com.demo.boot.biz.common.web;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.boot.biz.common.service.CommonService;
import com.demo.boot.utils.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/common")
@RequiredArgsConstructor
//@Slf4j
public class CommonController {

    private final CommonService commonService;

    @PostMapping("code")
    public ApiResponse<?> selectCode(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(commonService.selectCode(params));
    }

    
}
