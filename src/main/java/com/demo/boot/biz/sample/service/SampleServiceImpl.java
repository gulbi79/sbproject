package com.demo.boot.biz.sample.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.demo.boot.biz.common.repository.CommonRepository;
import com.demo.boot.biz.common.utils.BizUtil;
import com.demo.boot.biz.sample.repository.SampleRepository;
import com.demo.boot.utils.SqlContextHolder;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class SampleServiceImpl implements SampleService {

    private final CommonRepository commonRepository;
    
    private final SampleRepository sampleRepository;

    public Map<String, Object> selectMain(Map<String,Object> paramMap) {
    	// 1. 조회조건에 따른 bucket 구간 조회
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	SqlContextHolder.THREAD_LOCAL_NONE_SQL.set(true);
    	
    	paramMap.putAll(BizUtil.getBucketYMWParams()); //bucket에 대한 공통파라미터 정의
    	List<Map<String,Object>> bucketList = commonRepository.selectCalBucket(paramMap);
		rtnMap.put("bucketList", bucketList);
		
		paramMap.put("bucketList" ,bucketList.stream().filter(map -> "WEEK".equals(map.get("calType"))).collect(Collectors.toList()));
		paramMap.put("f_useyny"   ,"on");
		
		// 2. 메인정보조회 
		SqlContextHolder.THREAD_LOCAL_NONE_SQL.set(false);
		rtnMap.put("sampleList", sampleRepository.selectSampleMain(paramMap));
    	return rtnMap;
    }
}
