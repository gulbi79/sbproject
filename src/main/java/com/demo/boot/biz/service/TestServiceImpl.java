package com.demo.boot.biz.service;

import com.demo.boot.biz.db2repository.TestRepository2;
import com.demo.boot.utils.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import static com.demo.boot.utils.ErrorCode.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {

    private final TestRepository2 testRepository;

    @Override
    public List<HashMap<String,Object>> getRoleList() {
        List<HashMap<String,Object>> rtnList = testRepository.getRoleList();
        if (rtnList.size() < 10) {
            throw new CustomException(NOT_FOUND,"error!!!!!!!");
        }

        return rtnList;
    }
}
