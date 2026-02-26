package com.bea.admin.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String matricule;
    private String password;
}