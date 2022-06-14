package com.demo.boot.common.web;

import com.demo.boot.common.service.UserService;
import com.demo.boot.common.vo.UserVo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/")
@RequiredArgsConstructor
public class HomeController {

    private final UserService userService;

    @GetMapping("/")
    public String homeView() {
        return "home";
    }

    @GetMapping("/index")
    public String indexView() {
        return "index";
    }

    @GetMapping("/top")
    public String topView() {
        return "top";
    }

    @GetMapping("/inner")
    public String innerView() {
        return "inner";
    }

    @GetMapping("/board/list")
    public String boardListView() {
        return "board/list";
    }

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
}
