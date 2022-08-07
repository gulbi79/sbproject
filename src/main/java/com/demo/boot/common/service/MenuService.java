package com.demo.boot.common.service;

import java.util.HashMap;

import com.demo.boot.common.vo.UserVo;

public interface MenuService {
	HashMap<String, String> menuInfo(String menuCd);
	UserVo menuInfo2();
}
