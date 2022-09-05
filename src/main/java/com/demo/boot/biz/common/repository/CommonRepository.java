package com.demo.boot.biz.common.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CommonRepository {
    List<Map<String,Object>> selectCalBase(Map<String,Object> paramMap);

    List<Map<String,Object>> selectCalBucket(Map<String,Object> paramMap);
}
