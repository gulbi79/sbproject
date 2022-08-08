package com.demo.boot.common.web;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.boot.common.service.AdminService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    
    @PostMapping("menu")
    public ResponseEntity<?> selectMenu(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok().body(adminService.selectMenu(params));
    }
}
