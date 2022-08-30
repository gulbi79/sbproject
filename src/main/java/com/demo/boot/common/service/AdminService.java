package com.demo.boot.common.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    
	List<Map<String, Object>> selectMenu(Map<String,Object> paramMap);

	Map<String, Object> saveMenu(Map<String,Object> paramMap);

	List<Map<String, Object>> selectCode(Map<String,Object> paramMap);
	
	Map<String, Object> saveCode(Map<String,Object> paramMap);

	Map<String, Object> selectRole(Map<String,Object> paramMap);
	
	Map<String, Object> saveRole(Map<String,Object> paramMap);

	List<Map<String, Object>> selectUser(Map<String,Object> paramMap);
	
	Map<String, Object> saveUser(Map<String,Object> paramMap);
	
}
