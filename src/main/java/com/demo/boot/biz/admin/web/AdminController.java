package com.demo.boot.biz.admin.web;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.boot.biz.admin.service.AdminService;
import com.demo.boot.utils.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    
    @PostMapping("menulist")
    public ApiResponse<?> selectMenu(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(adminService.selectMenu(params));
    }
    
    @PostMapping("menureg")
    public ApiResponse<?> saveMenu(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(adminService.saveMenu(params));
    }

    @PostMapping("codelist")
    public ApiResponse<?> selectCode(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.selectCode(params));
    }
    
    @PostMapping("codereg")
    public ApiResponse<?> saveCode(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.saveCode(params));
    }

    @PostMapping("rolelist")
    public ApiResponse<?> selectRole(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.selectRole(params));
    }

    @PostMapping("rolemenulist")
    public ApiResponse<?> selectRoleMenu(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.selectRoleMenu(params));
    }
    
    @PostMapping("rolereg")
    public ApiResponse<?> saveRole(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.saveRole(params));
    }
    
    @PostMapping("userlist")
    public ApiResponse<?> selectUser(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.selectUser(params));
    }

    @PostMapping("userrole")
    public ApiResponse<?> selectUserRole(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.selectUserRole(params));
    }
    
    @PostMapping("userreg")
    public ApiResponse<?> saveUser(@RequestBody Map<String, Object> params) {
    	return ApiResponse.createWrap(adminService.saveUser(params));
    }
    
    @PostMapping("boardlist")
    public ApiResponse<?> selectBoard(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(adminService.selectBoard(params));
    }
    
    @PostMapping("boardreg")
    public ApiResponse<?> saveBoard(@RequestBody Map<String, Object> params) {
        return ApiResponse.createWrap(adminService.saveBoard(params));
    }
}
