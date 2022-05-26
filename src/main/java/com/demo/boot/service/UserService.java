package com.demo.boot.service;

import com.demo.boot.vo.UserVo;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    void joinUser(UserVo uservo);

    UserVo loadUserByUsername(String userId);
}
