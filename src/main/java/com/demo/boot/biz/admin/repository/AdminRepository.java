package com.demo.boot.biz.admin.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminRepository {
    List<Map<String,Object>> selectMenu(Map<String,Object> paramMap);

    int saveMenu(Map<String,Object> paramMap);

    List<Map<String,Object>> selectCode(Map<String,Object> paramMap);
    
    int saveCode(Map<String,Object> paramMap);

    List<Map<String,Object>> selectRole(Map<String,Object> paramMap);

    List<Map<String,Object>> selectRoleMenu(Map<String,Object> paramMap);

    String selectRole2(Map<String,Object> paramMap);
    
    int saveRole(Map<String,Object> paramMap);

    int saveRoleMenu(Map<String,Object> paramMap);

    List<Map<String,Object>> selectUser(Map<String,Object> paramMap);

    List<Map<String,Object>> selectUserRole(Map<String,Object> paramMap);
    
    void saveUser(Map<String,Object> paramMap);

    int saveUserRole(Map<String,Object> paramMap);
}
