package com.demo.boot.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.MyBatisSystemException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.boot.common.repository.AdminRepository;
import com.demo.boot.utils.SqlContextHolder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    //@Autowired
    private final AdminRepository adminRepository;

    public List<Map<String, Object>> selectMenu(Map<String,Object> paramMap) {
    	return adminRepository.selectMenu(paramMap);
    }
    
    @Transactional
    public Map<String, Object> saveMenu(Map<String,Object> paramMap) {
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	List<Map<String,Object>> grdData = (List<Map<String,Object>>)paramMap.get("grdData");
    	for (Map<String,Object> rowMap : grdData) {
    		adminRepository.saveMenu(rowMap);
    	}
    	
    	rtnMap.put("result", "ok");
    	return rtnMap;
    }

    public List<Map<String, Object>> selectCode(Map<String,Object> paramMap) {
    	return adminRepository.selectCode(paramMap);
    }
    
    @Transactional
    public Map<String, Object> saveCode(Map<String,Object> paramMap) {
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	List<Map<String,Object>> grdData = (List<Map<String,Object>>)paramMap.get("grdData");
    	for (Map<String,Object> rowMap : grdData) {
    		adminRepository.saveCode(rowMap);
    	}
    	
    	rtnMap.put("result", "ok");
    	return rtnMap;
    }

}
