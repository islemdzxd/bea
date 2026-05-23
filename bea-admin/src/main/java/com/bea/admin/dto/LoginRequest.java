package com.bea.admin.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;

@Data
public class LoginRequest {
    @JsonAlias({"cli", "matricule"})
    private String matricule;

    private String password;
}