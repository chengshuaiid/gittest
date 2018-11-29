package com.example.demo.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Created by hzl-coding on 2018/11/16.
 */
@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Double money;
    private String userid;

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Double getMoney() {
        return money;
    }

    public String getUserId() {
        return userid;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setMoney(Double money) {
        this.money = money;
    }

    public void setUserId(String userId) {
        this.userid = userId;
    }

    public Account() {
    }

    public Account(Integer id,String userId, String name, Double money) {
        this.id = id;
        this.userid = userId;
        this.name = name;
        this.money = money;
    }
}