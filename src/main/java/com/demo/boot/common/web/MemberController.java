package com.demo.boot.common.web;

import java.util.ArrayList;
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
import com.demo.boot.common.service.TreeService;
import com.demo.boot.common.service.UserService;
import com.demo.boot.common.vo.UserVo;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class MemberController {

    private final UserService userService;
    private final MenuService menuService;
    private final TreeService treeService;

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
    	model.addAttribute("menuList", userService.userMenu(uservo.getUserId()));
    	
    	//2.사용자 정보
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
    
    @SuppressWarnings("unchecked")
	@GetMapping("/page/{menuCd}")
    public String goToInnerView(@PathVariable String menuCd, Model model) {
    	
    	//화면에서 받은 menu code로 mapping url을 조회 후 해당 화면을 리턴
    	HashMap<String, String> map = menuService.menuInfo(menuCd);
    	
    	String pageUrl = "login/denied";
    	if (map != null && !map.isEmpty()) {
    		String url = map.get("url");
    		if (url != null && !url.isEmpty()) {
    			pageUrl = url;
    			
    			//tree 조회
    			HashMap<String, Object> treeMap = treeService.selectTree();
    			
    			//ui에서 사용하기 편하게 레벨별로 분기한다.
    			//sales -----------------------
    			List<HashMap<String, String>> sales1 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> sales2 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> sales3 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> sales4 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> sales5 = new ArrayList<HashMap<String, String>>();
    			for (HashMap<String, String> rMap : (List<HashMap<String, String>>)treeMap.get("salesTree")) {
    				if ("1".equals(String.valueOf(rMap.get("levelCd")))) sales1.add(rMap);
    				if ("2".equals(String.valueOf(rMap.get("levelCd")))) sales2.add(rMap);
    				if ("3".equals(String.valueOf(rMap.get("levelCd")))) sales3.add(rMap);
    				if ("4".equals(String.valueOf(rMap.get("levelCd")))) sales4.add(rMap);
    				if ("5".equals(String.valueOf(rMap.get("levelCd")))) sales5.add(rMap);
    			}
    			model.addAttribute("sales1",sales1); //salesTree 1 level
    			model.addAttribute("sales2",sales2); //salesTree 2 level
    			model.addAttribute("sales3",sales3); //salesTree 3 level
    			model.addAttribute("sales4",sales4); //salesTree 4 level
    			model.addAttribute("sales5",sales5); //salesTree 5 level

    			//product -----------------------
    			List<HashMap<String, String>> prod1 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> prod2 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> prod3 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> prod4 = new ArrayList<HashMap<String, String>>();
    			List<HashMap<String, String>> prod5 = new ArrayList<HashMap<String, String>>();
    			for (HashMap<String, String> rMap : (List<HashMap<String, String>>)treeMap.get("productTree")) {
    				if ("1".equals(String.valueOf(rMap.get("levelCd")))) prod1.add(rMap);
    				if ("2".equals(String.valueOf(rMap.get("levelCd")))) prod2.add(rMap);
    				if ("3".equals(String.valueOf(rMap.get("levelCd")))) prod3.add(rMap);
    				if ("4".equals(String.valueOf(rMap.get("levelCd")))) prod4.add(rMap);
    				if ("5".equals(String.valueOf(rMap.get("levelCd")))) prod5.add(rMap);
    			}
    			model.addAttribute("prod1",prod1); //salesTree 1 level
    			model.addAttribute("prod2",prod2); //salesTree 2 level
    			model.addAttribute("prod3",prod3); //salesTree 3 level
    			model.addAttribute("prod4",prod4); //salesTree 4 level
    			model.addAttribute("prod5",prod5); //salesTree 5 level
    			
    			model.addAllAttributes(treeMap); //salesTree, productTree
    		}
    	}
    	
    	model.addAllAttributes(map);
        return pageUrl;
    }
}
