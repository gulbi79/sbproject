package com.demo.boot.common.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.demo.boot.common.repository.MenuRepository;
import com.demo.boot.common.vo.UserVo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    private final MenuRepository menuRepository;

    public HashMap<String, String> menuInfo(String menuCd) {
    	HashMap<String, String> rtnMap = null;
    	rtnMap = menuRepository.menuInfo(menuCd);
        return rtnMap;
    }

    public UserVo menuInfo2() {
    	UserVo uservo = menuRepository.menuInfo2();
    	return uservo;
    }
}