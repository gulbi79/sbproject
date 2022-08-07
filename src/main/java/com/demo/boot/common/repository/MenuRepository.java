package com.demo.boot.common.repository;

import org.apache.ibatis.annotations.Mapper;

import com.demo.boot.common.vo.UserVo;

import java.util.HashMap;

@Mapper
public interface MenuRepository {
    HashMap<String,String> menuInfo(String menuCd);
    UserVo menuInfo2();
}
