package com.example.demo;

import org.apache.activemq.ActiveMQConnectionFactory;
import org.apache.activemq.command.ActiveMQQueue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.jms.core.JmsTemplate;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import javax.jms.ConnectionFactory;
import javax.jms.Queue;

@SpringBootApplication
public class DemoApplication {

	@Autowired
	private RestTemplateBuilder builder;

	@Bean
	public RestTemplate restTemplate() {
		return builder.build();
	}

	@Bean
	public ConnectionFactory connectionFactory(){
		ActiveMQConnectionFactory connectionFactory = new ActiveMQConnectionFactory();
		connectionFactory.setBrokerURL("tcp://localhost:61616");
		connectionFactory.setUserName("admin");
		connectionFactory.setPassword("admin");
		return connectionFactory;
	}

	@Bean
	JmsTemplate jmsTemplate(ConnectionFactory connectionFactory) {
		JmsTemplate jmsTemplate = new JmsTemplate(connectionFactory);
		jmsTemplate.setPriority(999);
		return jmsTemplate;
	}
	@Bean(value="jmsMessagingTemplate")
	JmsMessagingTemplate jmsMessagingTemplate(JmsTemplate jmsTemplate) {
		JmsMessagingTemplate messagingTemplate = new JmsMessagingTemplate(jmsTemplate);
		return messagingTemplate;
	}

	/**
	 * 创建消息队列
	 * @return
     */
	@Bean
	public Queue queue() {
		return new ActiveMQQueue("active.queue");
	}


	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}
}
