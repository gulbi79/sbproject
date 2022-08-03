package com.demo.boot.common.db2repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;

@Mapper
public interface MenuRepository {
    HashMap<String,String> menuInfo(String menuCd);
}
