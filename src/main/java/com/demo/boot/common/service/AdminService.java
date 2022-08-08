package com.demo.boot.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.demo.boot.common.vo.UserVo;

public interface AdminService {
    
	List<HashMap<String, Object>> selectMenu(Map<String,Object> paramMap);
	
}
