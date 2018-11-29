package com.example.demo.config;

import com.example.demo.inteceptor.LoginInteceptor;
import com.example.demo.inteceptor.TimeRecordInteceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by hzl-coding on 2018/11/14.
 */
@EnableWebMvc
@Configuration
public class InteceptorConfig extends WebMvcConfigurerAdapter{

    @Bean
    public LoginInteceptor loginInteceptor(){
        return new LoginInteceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new TimeRecordInteceptor()).addPathPatterns("/**");
        registry.addInterceptor(loginInteceptor()).addPathPatterns("/**");
        //registry.addInterceptor(loginInteceptor()).addPathPatterns("/**").excludePathPatterns("/**/*login*").excludePathPatterns("/**/*webIn*");
        super.addInterceptors(registry);
    }
}
