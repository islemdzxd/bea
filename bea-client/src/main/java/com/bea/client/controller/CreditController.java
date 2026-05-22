package com.bea.client.controller;

import com.bea.client.dto.credit.CreditContextResponse;
import com.bea.client.dto.credit.CreditRequestResponse;
import com.bea.client.dto.credit.CreditSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.service.CreditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/credit")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CreditController {

	private final CreditService creditService;

	@GetMapping("/me/context")
	public ResponseEntity<CreditContextResponse> getContext(Authentication authentication) {
		return ResponseEntity.ok(creditService.getContext(getClient(authentication)));
	}

	@GetMapping("/me/requests")
	public ResponseEntity<List<CreditRequestResponse>> getHistory(Authentication authentication) {
		return ResponseEntity.ok(creditService.getHistory(getClient(authentication)));
	}

	@GetMapping("/me/requests/{numeroDossier}")
	public ResponseEntity<CreditRequestResponse> getRequest(Authentication authentication,
														   @PathVariable String numeroDossier) {
		return ResponseEntity.ok(creditService.getRequest(getClient(authentication), numeroDossier));
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<CreditRequestResponse> submit(Authentication authentication,
														@ModelAttribute CreditSubmissionRequest request) {
		return ResponseEntity.ok(creditService.submit(getClient(authentication), request));
	}

	private Client getClient(Authentication authentication) {
		Object principal = authentication.getPrincipal();
		if (!(principal instanceof Client client)) {
			throw new IllegalStateException("Authenticated client not found");
		}
		return client;
	}
}
