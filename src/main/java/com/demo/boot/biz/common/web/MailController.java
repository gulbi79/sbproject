package com.demo.boot.biz.common.web;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.demo.boot.biz.common.service.MailService;
import com.demo.boot.common.vo.AttachFileVo;
import com.demo.boot.common.vo.MailVo;

import lombok.RequiredArgsConstructor;

@Controller
@RequestMapping(value = "/mail")
@RequiredArgsConstructor
//@Slf4j
public class MailController {

    private final MailService mailService;
    
    private static final String FROM_ADDRESS = "gulbi79@gmail.com";

    @GetMapping("send")
    public String mail() {
    	return "common/mailsend";
    }
    
    @PostMapping("sendProc")
    public String sendMail(MailVo mailVo) {
        String mailSubject = "첨부파일 메일 전송 테스트입니다.";
        String mailContent = "<p>안녕하세요.</p><p>"+ " 첨부파일 메일 전송 테스트입니다.</p><p>감사합니다.</p>";

//        List<String> toAddressList = ListUtil.splitStringToArrayList(this.getParam("options.toaddress"), ","); 
//        List<String> ccAddressList = ListUtil.splitStringToArrayList(this.getParam("options.ccaddress"), ","); 
//        List<String> bccAddressList = ListUtil.splitStringToArrayList(this.getParam("options.bccaddress"), ","); 
//        List<AtchFileDto> atchFileList = new ArrayList<>(Arrays.asList(new AtchFileDto(attachPath, attachName)));

        List<String> toAddressList = Arrays.asList("lovens3082@naver.com"); 
        List<String> ccAddressList = null; 
        List<String> bccAddressList = null; 
        List<AttachFileVo> atchFileList = null;

    	mailService.sendMail(new MailVo(FROM_ADDRESS, toAddressList, ccAddressList, bccAddressList, mailSubject, mailContent, true, atchFileList));
    	
    	return "redirect:/home";
    }
    
}
