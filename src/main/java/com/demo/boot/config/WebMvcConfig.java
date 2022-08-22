package com.demo.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.demo.boot.aop.ApiInterceptor;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {
    private final ApiInterceptor apiInterceptor;
    
    // Interceptor에서 제외되는 URL 주소
    private static final String[] EXCLUDE_PATHS = {
            "/static/*",
            "/api/auth/tokens"
    };

    @Override
    public void addInterceptors (InterceptorRegistry registry) {
        registry.addInterceptor(apiInterceptor)
                .excludePathPatterns(EXCLUDE_PATHS) //인터셉터에 포함되지 않음
                .addPathPatterns("/*/*") //인터셉터에 포함됨
        ;
    }
}
