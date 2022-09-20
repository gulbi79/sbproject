package com.demo.boot.biz.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public interface CommonService {
	HashMap<String, Object> selectTree();

	List<Map<String, Object>> selectCode(Map<String,Object> paramMap);

}
