package com.demo.boot.biz2.sample.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SampleRepository {
    List<Map<String,Object>> selectSample1(Map<String,Object> paramMap);
}
