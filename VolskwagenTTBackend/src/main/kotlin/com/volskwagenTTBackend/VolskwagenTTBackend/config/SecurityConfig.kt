package com.volskwagenTTBackend.VolskwagenTTBackend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.filter.CorsFilter

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain{
        http.csrf { csrf -> csrf.disable() }
            .authorizeHttpRequests{ auth ->
                auth.requestMatchers("/h2-console/**").permitAll()
                    .requestMatchers(("/api/**")).permitAll()
                    .anyRequest().permitAll()
            }

            .headers { headers ->
                headers
                    .frameOptions { frameOptions -> frameOptions.sameOrigin() }
                    .contentTypeOptions {contentTypeOptions -> contentTypeOptions.disable()}
            }

        return http.build()
    }

    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration()
        config.allowCredentials = true
        config.addAllowedOrigin("http://localhost:5173")
        config.addAllowedHeader("*")
        config.addAllowedMethod("*")
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }

}