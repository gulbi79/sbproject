package com.demo.boot.biz2.sample.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.demo.boot.biz.common.repository.CommonRepository;
import com.demo.boot.biz.common.utils.BizUtil;
import com.demo.boot.biz2.sample.repository.SampleRepository;
import com.demo.boot.utils.SqlContextHolder;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
//@Slf4j
public class SampleServiceImpl implements SampleService {

private final CommonRepository commonRepository;
    
    private final SampleRepository sampleRepository;

    public Map<String, Object> selectSample1(Map<String,Object> paramMap) {
    	// 1. 조회조건에 따른 bucket 구간 조회
    	Map<String, Object> rtnMap = new HashMap<String, Object>();
    	SqlContextHolder.THREAD_LOCAL_NONE_SQL.set(true);
    	
    	paramMap.putAll(BizUtil.getBucketYMWParams()); //bucket 조회시 필요한 공통파라미터 정의
    	List<Map<String,Object>> bucketList = commonRepository.selectCalBucket(paramMap);
		rtnMap.put("bucketList", bucketList);
		
		paramMap.putAll(BizUtil.getBucketResultParams(bucketList, "WEEK")); //조회된 bucket으로 공통파라미터 정의
		
		// 2. 메인정보조회 
		SqlContextHolder.THREAD_LOCAL_NONE_SQL.set(false);
		rtnMap.put("sampleList", sampleRepository.selectSample1(paramMap));
    	return rtnMap;
    }
}
