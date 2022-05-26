package com.demo.boot.web;

import com.demo.boot.service.UserService;
import com.demo.boot.vo.UserVo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public String root() {

        return "redirect:login";
    }

    @GetMapping("/login")
    public String login() {

        return "login/login";
    }

    @GetMapping("/signUp")
    public String signUpForm() {

        return "login/signUp";
    }

    @GetMapping("/access_denied")
    public String accessDenied() {

        return "login/user_denied";
    }

    @PostMapping("/signUp")
    public String signUp(UserVo userVo) {

        userService.joinUser(userVo);
        return "redirect:login";
    }

    @GetMapping("/user_access")
    public String userAccess(Model model, Authentication authentication) {
        //Authentication 객체를 통해 유저 정보를 가져올 수 있다.
        UserVo userVo = (UserVo) authentication.getPrincipal();  //userDetail 객체를 가져옴
        model.addAttribute("info", userVo.getUserId() + "의 " + userVo.getUserName() + "님");      //유저 아이디
        return "login/user_access";
    }
}
