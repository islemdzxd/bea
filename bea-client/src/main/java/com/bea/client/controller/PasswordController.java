package com.bea.client.controller;

import com.bea.client.dto.ChangePasswordRequest;
import com.bea.client.model.Client;
import com.bea.client.service.PasswordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/password")
@RequiredArgsConstructor
public class PasswordController {

	private final PasswordService passwordService;

	@PostMapping("/change")
	public ResponseEntity<Map<String, String>> changePassword(@RequestBody ChangePasswordRequest request) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication == null || !(authentication.getPrincipal() instanceof Client client)) {
			throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
		}

		passwordService.changePassword(client, request);
		return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
	}
}
