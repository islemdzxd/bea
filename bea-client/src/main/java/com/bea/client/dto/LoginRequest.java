package com.bea.client.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String cli;
    private String password;
}
