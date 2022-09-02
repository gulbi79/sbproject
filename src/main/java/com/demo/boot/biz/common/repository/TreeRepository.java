package com.demo.boot.biz.common.repository;

import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TreeRepository {
    List<HashMap<String,String>> sales();

    List<HashMap<String,String>> product();
}
