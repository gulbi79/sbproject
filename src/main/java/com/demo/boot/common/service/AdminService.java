package com.demo.boot.common.service;

import java.util.List;
import java.util.Map;

public interface AdminService {
    
	List<Map<String, Object>> selectMenu(Map<String,Object> paramMap);
	
}
