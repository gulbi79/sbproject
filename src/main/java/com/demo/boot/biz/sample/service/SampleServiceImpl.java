package com.demo.boot.biz.sample.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.demo.boot.aop.GlobalExceptionHandler;
import com.demo.boot.biz.common.repository.CommonRepository;
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
    	SqlContextHolder.THREAD_LOCAL_STOP_SQLYN.set(true);
    	paramMap.put("bucketType", "_YEAR_MONTH_WEEK_");
    	
    	String strParentBucket = null;
    	for (String tmpBucket : StringUtils.tokenizeToStringArray("_YEAR_MONTH_WEEK_", "_")) {
    		paramMap.put(tmpBucket.toLowerCase().concat("Parent"), strParentBucket);
    		
    		if (strParentBucket == null) {
    			strParentBucket = tmpBucket;
    		} else {
    			strParentBucket = strParentBucket.concat(" || ").concat(tmpBucket);
    		}
    		paramMap.put(tmpBucket.toLowerCase().concat("Uniq"), strParentBucket);
//    		log.info("tmpBucket -> {}",tmpBucket);
    	}
    	
//    	paramMap.put("MONTH_PARENT", "YEAR");
//    	paramMap.put("WEEK_PARENT", "MONTH");
    	List<Map<String,Object>> bucketList = commonRepository.selectCalBucket(paramMap);
		rtnMap.put("bucketList", bucketList);
		
		// 2. 메인정보조회 
		paramMap.put("bucketList" ,bucketList.stream().filter(map -> "WEEK".equals(map.get("calType"))).collect(Collectors.toList()));
		paramMap.put("f_useyny"   ,"on");
		SqlContextHolder.THREAD_LOCAL_STOP_SQLYN.set(false);
		rtnMap.put("sampleList", sampleRepository.selectSampleMain(paramMap));
    	return rtnMap;
    }
}
