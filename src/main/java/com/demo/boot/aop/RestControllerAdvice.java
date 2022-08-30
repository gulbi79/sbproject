package com.demo.boot.aop;

import org.springframework.core.MethodParameter;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

import com.demo.boot.utils.SqlContextHolder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
//@ControllerAdvice
//@RestControllerAdvice
public class RestControllerAdvice<T> implements ResponseBodyAdvice<T> {

    @Override
    public boolean supports(MethodParameter returnType, Class<? extends HttpMessageConverter<?>> converterType) {
    	log.info("RestControllerAdvice supports");
    	return SqlContextHolder.THREAD_LOCAL_SQLYN.get();
    }

    @Override
    public T beforeBodyWrite(T body, MethodParameter returnType, MediaType selectedContentType, Class<? extends HttpMessageConverter<?>> selectedConverterType, ServerHttpRequest request, ServerHttpResponse response) {
    	log.info("beforeBodyWrite body => {}", body);
    	//log.info("sql=> {}", SqlContextHolder.THREAD_LOCAL_SQL);
        // 작업할 내용 작성...
        
        return body;
    }
}
