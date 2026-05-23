package com.bea.client.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${bea.uploads.root:uploads}")
    private String uploadsRoot;

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        Path uploadRootPath = Paths.get(uploadsRoot).toAbsolutePath().normalize();
        String uploadLocation = uploadRootPath.toUri().toString();
        if (!uploadLocation.endsWith("/")) {
            uploadLocation = uploadLocation + "/";
        }
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadLocation);
    }

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry.addMapping("/uploads/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:3001")
                .allowedMethods("GET", "HEAD", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("Content-Disposition", "Content-Type");
    }
}