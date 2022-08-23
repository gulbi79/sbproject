package com.demo.boot.aop;

import com.demo.boot.utils.CustomException;
import com.demo.boot.utils.ErrorCode;
import com.demo.boot.utils.ErrorResponse;
import com.demo.boot.utils.SqlContextHolder;

import lombok.extern.slf4j.Slf4j;

import org.mybatis.spring.MyBatisSystemException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ExceptionHandlerExceptionResolver;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    /*
    @ExceptionHandler(value = { ConstraintViolationException.class, DataIntegrityViolationException.class})
    protected ResponseEntity<ErrorResponse> handleDataException() {
        log.error("handleDataException throw Exception : {}", DUPLICATE_RESOURCE);
        return ErrorResponse.toResponseEntity(DUPLICATE_RESOURCE);
    }
     */

    @ExceptionHandler(value = { CustomException.class })
    protected ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        //log.error("handleCustomException throw CustomException : {}", e.getMessage());
        return ErrorResponse.toResponseEntity(e.getErrorCode(), e.getMessage());
    }
    
    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<ErrorResponse> handleSqlException(Exception e) {
        //log.error("handleSqlException",e);
        return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, "SQL Error");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        //log.error("handleException",e);
        if (SqlContextHolder.THREAD_LOCAL_SQLYN.get()) {
    		return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, SqlContextHolder.THREAD_LOCAL_SQL.get());
    	} else {
    		return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, "Server Error");
    	}
    }

}
