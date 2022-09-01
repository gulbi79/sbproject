package com.demo.boot.common.repository;

import com.demo.boot.common.vo.UserVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.HashMap;
import java.util.List;

@Mapper
public interface UserRepository {
    List<HashMap<String,Object>> selectUser(HashMap<String,Object> paramMap);

    //Integer insertUser(HashMap<String,Object> paramMap);

    // 로그인
    UserVo getUserAccount(String userId);

    List<String> getUserAuthorities(String userId);

    // 회원가입
    void saveUser(UserVo userVo);

    List<HashMap<String, String>> userMenu(HashMap<String,Object> paramMap);
}
