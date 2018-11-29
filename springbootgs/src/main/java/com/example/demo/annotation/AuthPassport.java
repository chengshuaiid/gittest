package com.example.demo.annotation;

import java.lang.annotation.*;

/**
 * Created by moon on 16/3/6.
 */
@Documented
@Inherited
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface AuthPassport {
    boolean validate() default true;
}
