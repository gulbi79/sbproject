package com.demo.boot.aop;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.demo.boot.utils.ApiResponse;
import com.demo.boot.utils.CustomException;

import lombok.extern.slf4j.Slf4j;

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
    protected ResponseEntity<?> handleCustomException(CustomException e) {
        //log.error("handleCustomException throw CustomException : {}", e.getMessage());
        //return ErrorResponse.toResponseEntity(e.getErrorCode(), e.getMessage());
        return ResponseEntity.status(999).body(ApiResponse.createError(e.getMessage()));
    }
    
    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<?> handleSqlException(Exception e) {
        //log.error("handleSqlException",e);
//        return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, "SQL Error");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.createError("SQL Error"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        log.error("handleException",e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ApiResponse.createError("Server Error"));
//        if (SqlContextHolder.THREAD_LOCAL_SQLYN.get()) {
//    		return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, SqlContextHolder.THREAD_LOCAL_SQL.get());
//    	} else {
        
//    		return ErrorResponse.toResponseEntity(ErrorCode.INTER_SERVER_ERROR, "Server Error");
//    	}
    }

}
