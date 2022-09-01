package com.demo.boot.common.service;

import java.util.HashMap;
import java.util.List;

import org.springframework.security.core.userdetails.UserDetailsService;

import com.demo.boot.common.vo.UserVo;

public interface UserService extends UserDetailsService {
    void joinUser(UserVo uservo);

    UserVo loadUserByUsername(String userId);
    
    List<HashMap<String, String>> userMenu(HashMap<String,Object> paramMap);
}
