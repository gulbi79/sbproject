package com.demo.boot.common.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.demo.boot.common.repository.TreeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TreeServiceImpl implements TreeService {

    private final TreeRepository treeRepository;

    public HashMap<String, Object> selectTree() {
    	HashMap<String, Object> rtnMap = new HashMap<String, Object>();
    	rtnMap.put("salesTree", treeRepository.sales());
    	rtnMap.put("productTree", treeRepository.product());
        return rtnMap;
    }
}
