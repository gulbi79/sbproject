package com.demo.boot.biz.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.demo.boot.biz.common.repository.CommonRepository;
import com.demo.boot.biz.common.repository.TreeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonServiceImpl implements CommonService {

    private final CommonRepository commonRepository;
    private final TreeRepository treeRepository;

    public HashMap<String, Object> selectTree() {
    	HashMap<String, Object> rtnMap = new HashMap<String, Object>();
    	rtnMap.put("salesTree", treeRepository.sales());
    	rtnMap.put("productTree", treeRepository.product());
        return rtnMap;
    }
    
    public List<Map<String, Object>> selectCode(Map<String,Object> paramMap) {
    	return commonRepository.selectCode(paramMap);
    }

}
