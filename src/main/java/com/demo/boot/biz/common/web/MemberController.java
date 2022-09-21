package com.demo.boot.biz.common.web;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.thymeleaf.util.StringUtils;

import com.demo.boot.biz.common.service.CommonService;
import com.demo.boot.biz.common.service.UserService;
import com.demo.boot.common.vo.UserVo;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
//@Slf4j
public class MemberController {

    private final UserService userService;
    private final CommonService commonService;

    @GetMapping("/auth/login")
    public String loginView(@AuthenticationPrincipal UserVo uservo) {
    	if (uservo != null && !StringUtils.isEmpty(uservo.getUserId())) return "redirect:/home";
    	else return "auth/login";
    }

    @GetMapping("/auth/logout")
    public String logoutView() {
    	return "auth/logout";
    }

    @GetMapping("/auth/signup")
    public String signupView() {
        return "auth/signup";
    }

    @PostMapping("/auth/signupProc")
    public String signup(UserVo userVo) {
        userService.joinUser(userVo);
        return "redirect:/auth/login";
    }
    
    @GetMapping("/home")
    public String loginAfterView(@AuthenticationPrincipal UserVo uservo, Model model) {
    	//1.로그인한 유저의 권한에 따른 메뉴 조회
    	HashMap<String,Object> paramMap = new HashMap<String,Object>();
    	paramMap.put("userId", uservo.getUserId());
    	model.addAttribute("menuList", userService.userMenu(paramMap));
    	
        return "layouts/top";
    }

    @GetMapping("/auth/denied")
    public String deniedView() {
        return "auth/denied";
    }

    @GetMapping("/auth/sessionexpired")
    public String sessionexpiredView() {
    	return "auth/sessionexpired";
    }
    
    @SuppressWarnings("unchecked")
	@GetMapping("/page/{menuCd}")
    public String goToInnerView(@PathVariable String menuCd, Model model, @AuthenticationPrincipal UserVo uservo) {
    	String pageUrl = "auth/denied";
    	
    	if (uservo == null || StringUtils.isEmpty(uservo.getUserId())) return "auth/sessionexpired";
    	
    	//화면에서 받은 menu code로 mapping url을 조회 후 해당 화면을 리턴
    	HashMap<String,Object> paramMap = new HashMap<String,Object>();
    	paramMap.put("userId", uservo.getUserId());
    	paramMap.put("menuCd", menuCd);
    	List<HashMap<String, String>> menuList = userService.userMenu(paramMap);
    	
    	if (menuList.size() > 0) {
    		HashMap<String, String> map = menuList.get(0);
    		String url = map.get("url");
    		String tree = map.get("tree");
    		if (url != null && !url.isEmpty()) {
    			pageUrl = url;
    			
    			//tree 조회
    			HashMap<String, Object> treeMap = commonService.selectTree();
    			model.addAllAttributes(treeMap); //salesTree, productTree

    			//ui에서 사용하기 편하게 레벨별로 분기한다.
    			
    			//sales -----------------------
    			if (",SALES,".indexOf(tree) != -1) {
    				List<HashMap<String, String>> salesList = (List<HashMap<String, String>>)treeMap.get("salesTree");
    				model.addAttribute("sales1",salesList.stream().filter(t->"1".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //salesTree 1 level
    				model.addAttribute("sales2",salesList.stream().filter(t->"2".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //salesTree 2 level
    				model.addAttribute("sales3",salesList.stream().filter(t->"3".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //salesTree 3 level
    				model.addAttribute("sales4",salesList.stream().filter(t->"4".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //salesTree 4 level
    				model.addAttribute("sales5",salesList.stream().filter(t->"5".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //salesTree 5 level
    				
				//product -----------------------
    			} else if (",PRODUCT,".indexOf(tree) != -1) {
    				List<HashMap<String, String>> productList = (List<HashMap<String, String>>)treeMap.get("productTree");
    				
    				model.addAttribute("prod1",productList.stream().filter(t->"1".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //productTree 1 level
    				model.addAttribute("prod2",productList.stream().filter(t->"2".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //productTree 2 level
    				model.addAttribute("prod3",productList.stream().filter(t->"3".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //productTree 3 level
    				model.addAttribute("prod4",productList.stream().filter(t->"4".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //productTree 4 level
    				model.addAttribute("prod5",productList.stream().filter(t->"5".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //productTree 5 level

    			//plant -----------------------
    			} else if (",PLANT,".indexOf(tree) != -1) {
    				List<HashMap<String, String>> plantList = (List<HashMap<String, String>>)treeMap.get("plantTree");
    				
    				model.addAttribute("plant1",plantList.stream().filter(t->"1".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //plantTree 1 level
    				model.addAttribute("plant2",plantList.stream().filter(t->"2".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //plantTree 2 level
    				model.addAttribute("plant3",plantList.stream().filter(t->"3".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //plantTree 3 level
    				model.addAttribute("plant4",plantList.stream().filter(t->"4".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //plantTree 4 level
    				model.addAttribute("plant5",plantList.stream().filter(t->"5".equals(String.valueOf(t.get("levelCd")))).collect(Collectors.toList())); //plantTree 5 level
    			}
    		}
    		model.addAllAttributes(map);
    	}
        return pageUrl;
    }
}
