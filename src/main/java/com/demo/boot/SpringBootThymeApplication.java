package com.demo.boot;

import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;

@SpringBootApplication
public class SpringBootThymeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootThymeApplication.class);
    }
    
    @PostConstruct
    public void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));

    }

}
