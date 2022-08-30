package com.demo.boot.biz.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.stereotype.Service;

import com.demo.boot.biz.repository.TestRepository;
import com.demo.boot.utils.CustomException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {

    private final TestRepository testRepository;

    @Override
    public List<HashMap<String,Object>> getRoleList() {
        List<HashMap<String,Object>> rtnList = testRepository.getRoleList();
        if (rtnList.size() < 10) {
            throw new CustomException("error!!!!!!!");
        }

        return rtnList;
    }
}
