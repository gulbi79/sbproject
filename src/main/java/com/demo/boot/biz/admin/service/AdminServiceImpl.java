package com.demo.boot.biz.admin.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.demo.boot.biz.admin.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    //@Autowired
    private final AdminRepository adminRepository;

    public List<Map<String, Object>> selectMenu(Map<String,Object> paramMap) {
    	return adminRepository.selectMenu(paramMap);
    }
    
    @SuppressWarnings("unchecked")
	@Transactional
    public int saveMenu(Map<String,Object> paramMap) {
    	int rtnInt = 0;
    	List<Map<String,Object>> grdData = (List<Map<String,Object>>)paramMap.get("grdData");
    	for (Map<String,Object> rowMap : grdData) {
    		rtnInt += adminRepository.saveMenu(rowMap);
    	}
    	
    	return rtnInt;
    }

    public List<Map<String, Object>> selectCode(Map<String,Object> paramMap) {
    	return adminRepository.selectCode(paramMap);
    }
    
    @SuppressWarnings("unchecked")
	@Transactional
    public int saveCode(Map<String,Object> paramMap) {
    	int rtnInt = 0;
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	List<Map<String,Object>> grdData = (List<Map<String,Object>>)paramMap.get("grdData");
    	for (Map<String,Object> rowMap : grdData) {
    		rtnInt += adminRepository.saveCode(rowMap);
    	}
    	
    	return rtnInt;
    }

    public Map<String, Object> selectRole(Map<String,Object> paramMap) {
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
		rtnMap.put("roleList", adminRepository.selectRole(paramMap));
		
		paramMap.put("f_useyny", "on");
		rtnMap.put("menuList", adminRepository.selectMenu(paramMap));
    	return rtnMap;
    }

    public List<Map<String, Object>> selectRoleMenu(Map<String,Object> paramMap) {
    	return adminRepository.selectRoleMenu(paramMap);
    }

    
    @SuppressWarnings("unchecked")
	@Transactional
    public int saveRole(Map<String,Object> paramMap) {
    	int rtnInt = 0;
    	for (Map<String,Object> rowMap : (List<Map<String,Object>>)paramMap.get("grdData")) {
    		rtnInt += adminRepository.saveRole(rowMap);
    	}
    	
    	//rolemenu 저장
    	List<Map<String,Object>> uRoleMenuList = (List<Map<String,Object>>)paramMap.get("uRoleMenuList");
    	if (uRoleMenuList.size() > 0) adminRepository.saveRoleMenu(paramMap);
    	
    	return rtnInt;
    }

    public Map<String, Object> selectUser(Map<String,Object> paramMap) {
    	
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
		rtnMap.put("userList", adminRepository.selectUser(paramMap));
		
//		paramMap.put("f_useyny", "on");
		rtnMap.put("roleList", adminRepository.selectRole(paramMap));
    	return rtnMap;
    }
    
    public List<Map<String, Object>> selectUserRole(Map<String,Object> paramMap) {
    	return adminRepository.selectUserRole(paramMap);
    }

    @SuppressWarnings("unchecked")
	@Transactional
    public int saveUser(Map<String,Object> paramMap) {
    	int rtnInt = 0;
    	/*
    	for (Map<String,Object> rowMap : (List<Map<String,Object>>)paramMap.get("grdData")) {
    		rtnInt += adminRepository.saveRole(rowMap);
    	}
    	*/
    	
    	//usrerole 저장
    	List<Map<String,Object>> uUserRoleList = (List<Map<String,Object>>)paramMap.get("uUserRoleList");
    	if (uUserRoleList.size() > 0) adminRepository.saveUserRole(paramMap);
    	
    	return rtnInt;
    }
    
    public List<Map<String, Object>> selectBoard(Map<String,Object> paramMap) {
    	List<Map<String, Object>> rtnList = adminRepository.selectBoard(paramMap);
        return rtnList;
    }
    
    @SuppressWarnings("unchecked")
	@Transactional
    public int saveBoard(Map<String,Object> paramMap) {
        int rtnInt = 0;
        rtnInt += adminRepository.saveBoard((Map<String, Object>) paramMap.get("grdData"));
        
        return rtnInt;
    }
}
