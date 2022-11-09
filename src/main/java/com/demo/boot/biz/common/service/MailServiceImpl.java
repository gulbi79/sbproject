package com.demo.boot.biz.common.service;

import java.io.File;

import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.demo.boot.biz.common.utils.MailUtil;
import com.demo.boot.common.vo.AttachFileVo;
import com.demo.boot.common.vo.MailVo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    @Autowired
    private JavaMailSenderImpl javaMailSender;

    @Override
    public int sendMail(MailVo mailVo) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8"); // use multipart (true)

            InternetAddress[] toAddress = MailUtil.listToArray(mailVo.getToAddressList(), "UTF-8");
//            InternetAddress[] ccAddress = MailUtil.listToArray(mailVo.getCcAddressList(), "UTF-8");
//            InternetAddress[] bccAddress = MailUtil.listToArray(mailVo.getBccAddressList(), "UTF-8");

            mimeMessageHelper.setSubject(MimeUtility.encodeText(mailVo.getSubject(), "UTF-8", "B")); // Base64 encoding
            mimeMessageHelper.setText(mailVo.getContent(), mailVo.isUseHtmlYn()); 
            mimeMessageHelper.setFrom(new InternetAddress(mailVo.getFromAddress(), mailVo.getFromAddress(), "UTF-8"));
            mimeMessageHelper.setTo(toAddress);
//            mimeMessageHelper.setCc(ccAddress);
//            mimeMessageHelper.setBcc(bccAddress);

            if(!CollectionUtils.isEmpty(mailVo.getAttachFileList())) {
                for(AttachFileVo attachFileDto: mailVo.getAttachFileList()) {
                    FileSystemResource fileSystemResource = new FileSystemResource(new File(attachFileDto.getRealFileNm()));
                    mimeMessageHelper.addAttachment(MimeUtility.encodeText(attachFileDto.getAttachFileNm(), "UTF-8", "B"), fileSystemResource);
                }
            }

            javaMailSender.send(mimeMessage);

            log.info("MailServiceImpl.sendMail() :: SUCCESS");
        } catch (Exception e) {
        	log.info("MailServiceImpl.sendMail() :: FAILED");
            e.printStackTrace();
            
            return -1;
        }
        
        return 1;

    }

}
