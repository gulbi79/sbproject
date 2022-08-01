package com.demo.boot.biz.db1repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface TestRepository {
    List<HashMap<String,Object>> getRoleList();
}
