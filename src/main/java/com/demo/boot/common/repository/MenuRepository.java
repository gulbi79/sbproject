package com.demo.boot.common.repository;

import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MenuRepository {
    HashMap<String,String> menuInfo(String menuCd);
}
