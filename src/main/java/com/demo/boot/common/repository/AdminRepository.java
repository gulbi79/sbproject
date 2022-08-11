package com.demo.boot.common.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminRepository {
    List<Map<String,Object>> selectMenu(Map<String,Object> paramMap);

    void saveMenu(Map<String,Object> paramMap);
}
