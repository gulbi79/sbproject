package com.demo.boot.config;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

@Configuration
@MapperScan(basePackages="com.demo.boot.repository",sqlSessionFactoryRef="db1SqlSessionFactory")/*멀티DB사용시 mapper클래스파일 스켄용 basePackages를 DB별로 따로설정*/
@EnableTransactionManagement
public class MariadbConfig {

    @Bean(name="db1DataSource")
    @Primary
    @ConfigurationProperties(prefix="spring.db1.datasource") //appliction.properties 참고.
    public DataSource db1DataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name="db1SqlSessionFactory")
    @Primary
    public SqlSessionFactory sqlSessionFactory(@Qualifier("db1DataSource") DataSource db1DataSource, ApplicationContext applicationContext) throws Exception{
        final SqlSessionFactoryBean sessionFactory = new SqlSessionFactoryBean();
//        SqlSessionFactoryBean sessionFactory = new RefreshableSqlSessionFactoryBean();
        sessionFactory.setDataSource(db1DataSource);
        sessionFactory.setConfigLocation(applicationContext.getResource("classpath:mybatis/config/mybatis-config.xml")); //mybatis config.xml 설정
        sessionFactory.setMapperLocations(applicationContext.getResources("classpath:mybatis/mapper/*.xml")); //쿼리작성용 mapper.xml위치 설정.
//        ((RefreshableSqlSessionFactoryBean) sessionFactory).setInterval(1000);
        return sessionFactory.getObject();
    }

    @Bean(name="db1SqlSessionTemplate")
    @Primary
    public SqlSessionTemplate sqlSessionTemplate(SqlSessionFactory db1sqlSessionFactory) throws Exception{
        return new SqlSessionTemplate(db1sqlSessionFactory);
    }

    @Bean(name = "db1transactionManager")
    @Primary
    public PlatformTransactionManager transactionManager(@Qualifier("db1DataSource") DataSource db1DataSource) {
        return new DataSourceTransactionManager(db1DataSource);
    }
}