package com.demo.boot.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
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
    
    private static final String[] CLASSPATH_RESOURCE_LOCATIONS = { 
    		"classpath:/static/", "classpath:/public/", "classpath:/", 
            "classpath:/resources/", "classpath:/META-INF/resources/", "classpath:/META-INF/resources/webjars/" 
    };


    @Override
    public void addInterceptors (InterceptorRegistry registry) {
        registry.addInterceptor(apiInterceptor)
                .excludePathPatterns(EXCLUDE_PATHS) //인터셉터에 포함되지 않음
                .addPathPatterns("/*/*") //인터셉터에 포함됨
        ;
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // /에 해당하는 url mapping을 /common/test로 forward한다.
        registry.addViewController( "/" ).setViewName( "forward:/auth/login" );
        // 우선순위를 가장 높게 잡는다.
        registry.setOrder(Ordered.HIGHEST_PRECEDENCE);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
    }
}
