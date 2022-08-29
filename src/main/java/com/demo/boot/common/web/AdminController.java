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
    
    @PostMapping("menulist")
    public ResponseEntity<?> selectMenu(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok().body(adminService.selectMenu(params));
    }
    
    @PostMapping("menureg")
    public ResponseEntity<?> saveMenu(@RequestBody Map<String, Object> params) {
        return ResponseEntity.ok().body(adminService.saveMenu(params));
    }

    @PostMapping("codelist")
    public ResponseEntity<?> selectCode(@RequestBody Map<String, Object> params) {
    	return ResponseEntity.ok().body(adminService.selectCode(params));
    }
    
    @PostMapping("codereg")
    public ResponseEntity<?> saveCode(@RequestBody Map<String, Object> params) {
    	return ResponseEntity.ok().body(adminService.saveCode(params));
    }

    @PostMapping("rolelist")
    public ResponseEntity<?> selectRole(@RequestBody Map<String, Object> params) {
    	return ResponseEntity.ok().body(adminService.selectRole(params));
    }
    
    @PostMapping("rolereg")
    public ResponseEntity<?> saveRole(@RequestBody Map<String, Object> params) {
    	return ResponseEntity.ok().body(adminService.saveRole(params));
    }
}
