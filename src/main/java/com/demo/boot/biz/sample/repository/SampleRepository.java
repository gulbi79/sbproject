package com.demo.boot.biz.sample.repository;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SampleRepository {
    List<Map<String,Object>> selectSampleMain(Map<String,Object> paramMap);
}
