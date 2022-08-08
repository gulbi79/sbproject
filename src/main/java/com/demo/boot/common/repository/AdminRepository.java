package com.demo.boot.common.repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AdminRepository {
    List<HashMap<String,Object>> selectMenu(Map<String,Object> paramMap);
}
