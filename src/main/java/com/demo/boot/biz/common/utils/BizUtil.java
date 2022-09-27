package com.demo.boot.biz.common.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.util.StringUtils;

public class BizUtil {
	
	private static final String BUCKET_TYPE_YMW = "_YEAR_MONTH_WEEK_";
	private static final String BUCKET_TYPE_YM = "_YEAR_MONTH_";
	private static final String BUCKET_TYPE_MW = "_MONTH_WEEK_";
	
	private static Map<String,Object> getBucketDefaultParams(String bucketType) {
		Map<String,Object> bucketParams = new HashMap<String,Object>();
		bucketParams.put("bucketType", bucketType);
    	String strParentBucket = null;
    	for (String tmpBucket : StringUtils.tokenizeToStringArray(bucketType, "_")) {
    		bucketParams.put(tmpBucket.toLowerCase().concat("Parent"), strParentBucket);
    		
    		if (strParentBucket == null) {
    			strParentBucket = tmpBucket;
    		} else {
    			strParentBucket = strParentBucket.concat(" || ").concat(tmpBucket);
    		}
    		bucketParams.put(tmpBucket.toLowerCase().concat("Uniq"), strParentBucket);
    	}
    	
    	return bucketParams;
	}
	
	public static Map<String,Object> getBucketYMWParams() {
    	return getBucketDefaultParams(BUCKET_TYPE_YMW);
	}

	public static Map<String,Object> getBucketYMParams() {
		return getBucketDefaultParams(BUCKET_TYPE_YM);
	}

	public static Map<String,Object> getBucketMWParams() {
		return getBucketDefaultParams(BUCKET_TYPE_MW);
	}
	
	public static Map<String,Object> getBucketResultParams(List<Map<String,Object>> allBucketList, String calType) {
		Map<String,Object> bucketRtn = new HashMap<String,Object>();
		List<Map<String,Object>> calTypeBucketList = allBucketList.stream().filter(map -> calType.equals(map.get("calType"))).collect(Collectors.toList());
		bucketRtn.put("bucketList" ,calTypeBucketList);
		
		if ("WEEK".equals(calType)) {
			int calTypeLen = calTypeBucketList.size();
			bucketRtn.put("bucketStartWeek" ,calTypeLen > 0 ? calTypeBucketList.get(0).get("week") : null);
			bucketRtn.put("bucketEndWeek"   ,calTypeLen > 0 ? calTypeBucketList.get(calTypeLen-1).get("week") : null);
		}
		
		return bucketRtn;
	}
}
