package com.demo.boot.common.service;

import java.util.HashMap;

import org.springframework.stereotype.Service;

import com.demo.boot.common.db2repository.MenuRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MenuServiceImpl implements MenuService {

    //@Autowired
    private final MenuRepository menuRepository;

    public HashMap<String, String> menuInfo(String menuCd) {

        return menuRepository.menuInfo(menuCd);
    }
}
