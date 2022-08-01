package com.demo.boot.common.service;

import com.demo.boot.common.db2repository.UserRepository2;
import com.demo.boot.common.vo.UserVo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    //@Autowired
    private final UserRepository2 userRepository;

    @Transactional
    public void joinUser(UserVo userVo) {

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        userVo.setUserPw(passwordEncoder.encode(userVo.getPassword()));
        //userVo.setUserAuth("USER");
        userRepository.saveUser(userVo);
    }

    @Override
    public UserVo loadUserByUsername(String userId) throws UsernameNotFoundException {
        //여기서 받은 유저 패스워드와 비교하여 로그인 인증
        UserVo userVo = userRepository.getUserAccount(userId);
        if (userVo == null) {
            throw new UsernameNotFoundException("User not authorized.");
        }
        userVo.setAuthorities(getUserAuthorities(userVo.getUserId()));
        return userVo;
    }

    private List<GrantedAuthority> getUserAuthorities(String userId) {
        List<String> authorities = userRepository.getUserAuthorities(userId);
        List<GrantedAuthority> grantedAuthorities = new ArrayList<GrantedAuthority>();
        for (String auth : authorities) {
            grantedAuthorities.add(new SimpleGrantedAuthority(auth));
        }

        return grantedAuthorities;
    }
}
