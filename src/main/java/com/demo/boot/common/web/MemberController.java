package com.demo.boot.common.web;

import java.util.HashMap;
import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.demo.boot.common.service.MenuService;
import com.demo.boot.common.service.UserService;
import com.demo.boot.common.vo.UserVo;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class MemberController {

    private final UserService userService;
    private final MenuService menuService;

    @GetMapping("/login")
    public String loginView() {
        return "login/login";
    }

    @GetMapping("/signup")
    public String signupView() {
        return "login/signup";
    }

    @PostMapping("/signup")
    public String signup(UserVo userVo) {
        userService.joinUser(userVo);
        return "redirect:/login";
    }
    
    @GetMapping("/home")
    public String loginAfterView(@AuthenticationPrincipal UserVo uservo, Model model) {
    	//1.로그인한 유저의 권한에 따른 메뉴 조회
    	//2.사용자 정보
    	List<HashMap<String, String>> menuList = userService.userMenu(uservo.getUserId());
    	model.addAttribute("menuList", menuList);
        return "top";
    }

    //@PreAuthorize("hasRole('USER')")
    @GetMapping("/member/info")
    public String userInfoView() {
        return "login/user_info";
    }

    //@PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public String adminView() {
        return "login/admin";
    }

    @GetMapping("/denied")
    public String deniedView() {
        return "login/denied";
    }
    
    @GetMapping("/page/{menuCd}")
    public String goToInnerView(@PathVariable String menuCd, Model model) {
    	
    	//화면에서 받은 menu code로 mapping url을 조회 후 해당 화면을 리턴
    	HashMap<String, String> map = menuService.menuInfo(menuCd);
    	
    	String pageUrl = "login/denied";
    	if (map != null && !map.isEmpty()) {
    		String url = map.get("url");
    		if (url != null && !url.isEmpty()) {
    			pageUrl = url;
    		}
    	}
    	
    	model.addAllAttributes(map);
        return pageUrl;
    }
}
