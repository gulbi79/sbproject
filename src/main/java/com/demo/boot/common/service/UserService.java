package com.demo.boot.common.service;

import com.demo.boot.common.vo.UserVo;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    void joinUser(UserVo uservo);

    UserVo loadUserByUsername(String userId);
}
