package com.demo.boot.biz.sample.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.demo.boot.biz.common.repository.CommonRepository;
import com.demo.boot.biz.sample.repository.SampleRepository;
import com.demo.boot.utils.SqlContextHolder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SampleServiceImpl implements SampleService {

    private final CommonRepository commonRepository;
    
    private final SampleRepository sampleRepository;

    public Map<String, Object> selectMain(Map<String,Object> paramMap) {
    	// 1. 조회조건에 따른 bucket 구간 조회
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	SqlContextHolder.THREAD_LOCAL_STOP_SQLYN.set(true);
    	List<Map<String,Object>> bucketList = commonRepository.selectCalMonthWeek(paramMap);
		rtnMap.put("bucketList", bucketList);
		
		// 2. 메인정보조회 
		paramMap.put("bucketList" ,bucketList);
		paramMap.put("f_useyny"   ,"on");
		SqlContextHolder.THREAD_LOCAL_STOP_SQLYN.set(false);
		rtnMap.put("sampleList", sampleRepository.selectSampleMain(paramMap));
    	return rtnMap;
    }
}
