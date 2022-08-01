package com.demo.boot.biz.db2repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface TestRepository2 {
    List<HashMap<String,Object>> getRoleList();
}
