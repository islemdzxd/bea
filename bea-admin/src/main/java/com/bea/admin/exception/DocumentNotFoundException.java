package com.bea.admin.exception;

public class DocumentNotFoundException extends RuntimeException {

    public DocumentNotFoundException(String message) {
        super(message);
    }
}