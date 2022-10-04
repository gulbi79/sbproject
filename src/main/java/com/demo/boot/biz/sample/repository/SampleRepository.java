package com.demo.boot.biz.sample.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SampleRepository {
    List<Map<String,Object>> selectSample1(Map<String,Object> paramMap);

    List<Map<String,Object>> selectSample2(Map<String,Object> paramMap);

    List<Map<String,Object>> selectSample3(Map<String,Object> paramMap);
}
