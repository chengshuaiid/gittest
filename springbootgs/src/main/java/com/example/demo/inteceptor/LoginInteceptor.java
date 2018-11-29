package com.example.demo.inteceptor;

import com.example.demo.annotation.AuthPassport;
import com.example.demo.manage.SessionManager;
import com.example.demo.model.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.security.auth.message.AuthException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by hzl-coding on 2018/11/14.
 */
public class LoginInteceptor implements HandlerInterceptor {

    @Autowired
    SessionManager sessionManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object o) throws Exception {
        if (o.getClass().isAssignableFrom(HandlerMethod.class)) {
            AuthPassport authPassport = ((HandlerMethod) o).getMethodAnnotation(AuthPassport.class);
            //没有声明需要权限,或者声明不验证权限
            if (authPassport == null || authPassport.validate() == false) {
                return true;
            } else {
                //在这里实现自己的权限验证逻辑
                String token = request.getParameter("token");
                System.out.println(token);
                if (token == null || token == "") {
                    System.out.println("本次请求无效，没有token");
                    throw new AuthException("无效口令，请联系管理员获取口令再进行访问！");
                }
                Session session = sessionManager.get(token);
                if (session != null)//如果验证成功返回true（这里直接写false来模拟验证失败的处理）
                {
                    sessionManager.SetCurrentSessionToken(token);
                    return true;
                } else//如果验证失败
                {
                    throw new AuthException("您尚未登录系统或者登陆已过有效期，请重新登陆系统再进行访问！");
                }
            }
        } else {
            return true;
        }
    }

    @Override
    public void postHandle(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, ModelAndView modelAndView) throws Exception {
        System.out.println("登陆验证。。。。");
    }

    @Override
    public void afterCompletion(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, Object o, Exception e) throws Exception {
    }
}
