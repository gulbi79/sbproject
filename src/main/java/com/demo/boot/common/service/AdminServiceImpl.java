package com.demo.boot.common.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.demo.boot.common.repository.AdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    //@Autowired
    private final AdminRepository adminRepository;

    public List<HashMap<String, Object>> selectMenu(Map<String,Object> paramMap) {
    	return adminRepository.selectMenu(paramMap);
    }

}
