package com.demo.boot.aop;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.demo.boot.utils.SqlContextHolder;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class ApiInterceptor implements HandlerInterceptor {

    /*
     [PreHandle(HttpServletRequest request, HttpServletResponse response, Object handler)]
     - Controller로 보내기 전 이벤트 작동
     - false일 경우 실행 종료(Controller 진입 X)
     - Object handler는 HandlerMapping이 찾은 Controller Class 객체
  */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
//		log.info("getRequestURL : {}", request.getRequestURL());
    	SqlContextHolder.THREAD_LOCAL_SQLYN.set("Y".equals(request.getHeader("REQ_SQL")));
        return true;
    }

    /*
        [PostHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView)]
        - Controller 진입 후 View가 Rendering 되기 전 수행
        - ModelAndView modelAndView를 통해 화면 단에 들어가는 Data 등의 조작이 가능
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    	//log.info("response -> {}", response.getHeader("Content-Type"));
    }

    /*
        [afterComplete(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)]
        - Controller 진입 후 View가 정상적으로 Rendering 된 후 수행
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        log.info("afterCompletion [THREAD_LOCAL_SQL, THREAD_LOCAL_SQLYN, THREAD_LOCAL_STOP_SQLYN] remove");
    	// 스레드 로컬 정보 제거
    	SqlContextHolder.THREAD_LOCAL_SQL.remove();
    	SqlContextHolder.THREAD_LOCAL_SQLYN.remove();
    	SqlContextHolder.THREAD_LOCAL_NONE_SQL.remove();
    }
}
