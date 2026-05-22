package com.bea.client.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private LocalDate dateOfBirth;
}