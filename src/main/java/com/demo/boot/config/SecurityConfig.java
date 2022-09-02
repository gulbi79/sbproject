package com.demo.boot.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.boot.web.servlet.ServletListenerRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import com.demo.boot.biz.common.service.UserService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity        //spring security 를 적용한다는 Annotation
//@EnableGlobalMethodSecurity(prePostEnabled = false)
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    private final UserService userService;

    @Override
    public void configure(WebSecurity web) throws Exception {
        //web.ignoring().antMatchers("/css/**", "/js/**", "/img/**", "/lib/**");
    	web.ignoring().requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    /**
     * 규칙 설정
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {

    	// 인가정책
    	http.authorizeRequests()
	    	.antMatchers("/admin").hasAuthority("ADMIN")
	    	.antMatchers("/auth/**", "/page/**", "/static/**").permitAll() // 로그인 권한은 누구나, resources파일도 모든권한
	    	.anyRequest().authenticated();

    	// 인증정책
    	http.formLogin()
	    	.loginPage("/auth/login")
	    	.loginProcessingUrl("/auth/loginProc")
	    	.defaultSuccessUrl("/home", true)
	    	.failureUrl("/auth/denied")
    		.permitAll();

    	// 로그아웃
    	http.logout()
	    	.logoutRequestMatcher(new AntPathRequestMatcher("/auth/logoutProc"))
	    	.logoutSuccessUrl("/auth/logout")
	    	.invalidateHttpSession(true);
    	
    	http.exceptionHandling()
    		.accessDeniedPage("/auth/denied");
    	
    	http.headers()
    		.frameOptions().sameOrigin();
    	
    	http.csrf()
    		.disable();
    	
    	// 동시세션 정책
    	http.sessionManagement()
	        .maximumSessions(1)
	        .maxSessionsPreventsLogin(false)
	        .sessionRegistry(sessionRegistry())
	        .expiredUrl("/auth/sessionexpired");
    }

    /**
     * 로그인 인증 처리 메소드
     * @param auth
     * @throws Exception
     */
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(new BCryptPasswordEncoder());
    }
    
    // logout 후 login할 때 정상동작을 위함
    @Bean
    public SessionRegistry sessionRegistry() {
        return new SessionRegistryImpl();
    }

    // was가 여러개 있을 때(session clustering)
    @Bean
    public static ServletListenerRegistrationBean httpSessionEventPublisher() {
        return new ServletListenerRegistrationBean(new HttpSessionEventPublisher());
    }
}