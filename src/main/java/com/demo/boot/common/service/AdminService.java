package com.demo.boot.common.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    
	List<Map<String, Object>> selectMenu(Map<String,Object> paramMap);

	int saveMenu(Map<String,Object> paramMap);

	List<Map<String, Object>> selectCode(Map<String,Object> paramMap);
	
	int saveCode(Map<String,Object> paramMap);

	Map<String, Object> selectRole(Map<String,Object> paramMap);

	List<Map<String, Object>> selectRoleMenu(Map<String,Object> paramMap);
	
	int saveRole(Map<String,Object> paramMap);

	Map<String, Object> selectUser(Map<String,Object> paramMap);

	List<Map<String, Object>> selectUserRole(Map<String,Object> paramMap);
	
	int saveUser(Map<String,Object> paramMap);
	
}
