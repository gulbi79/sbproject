package com.demo.boot.common.vo;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MailVo {
	private String fromAddress;
    private List<String> toAddressList = new ArrayList<>();
    private List<String> ccAddressList = new ArrayList<>();
    private List<String> bccAddressList = new ArrayList<>();
    private String subject; // 제목
    private String content; // 메일 내용
    private boolean isUseHtmlYn; // 메일 형식이 HTML인지 여부(true, false)
    private List<AttachFileVo> attachFileList = new ArrayList<>();
}
