package com.petstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward SPA routes to index.html (exclude /api and static resources)
        registry.addViewController("/{path:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/{path1:[^\\.]*}/{path2:[^\\.]*}").setViewName("forward:/index.html");
        registry.addViewController("/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}").setViewName("forward:/index.html");
    }
}
