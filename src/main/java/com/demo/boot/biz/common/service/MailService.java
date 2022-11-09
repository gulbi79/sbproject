package com.demo.boot.biz.common.service;

import com.demo.boot.common.vo.MailVo;

public interface MailService {
	public int sendMail(MailVo mailVo);
}
