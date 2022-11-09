package com.demo.boot.biz.common.utils;

import java.io.UnsupportedEncodingException;
import java.util.List;

import javax.mail.internet.InternetAddress;

public class MailUtil {
	
	public static InternetAddress[] listToArray(List<String> addrList, String encoding) throws UnsupportedEncodingException {
		InternetAddress[] addresses = new InternetAddress[addrList.size()];
		for (String addr : addrList) {
			addresses[addresses.length-1] = new InternetAddress(addr, null, encoding);
		}
    	return addresses;
	}
}
