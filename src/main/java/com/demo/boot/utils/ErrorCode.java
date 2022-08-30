package com.demo.boot.utils;

import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public enum ErrorCode {

    NOT_FOUND(HttpStatus.NOT_FOUND,"PAGE NOT FOUND"),
//    INTER_SERVER_ERROR(500,"COMMON-ERR-500","INTER SERVER ERROR"),
//    EMAIL_DUPLICATION(400,"MEMBER-ERR-400","EMAIL DUPLICATED"),
	DUPLICATE_RESOURCE(HttpStatus.CONFLICT, "데이터가 이미 존재합니다"),
//    SQL_VIEW(997,"SQL_VIEW"),
    
    ;

	private final HttpStatus httpStatus;
//    private final int status;
//    private final String errorCode;
    private final String message;
}
