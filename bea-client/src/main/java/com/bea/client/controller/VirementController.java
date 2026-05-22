package com.bea.client.controller;

import com.bea.client.dto.virement.VirementContextResponse;
import com.bea.client.dto.virement.VirementResponse;
import com.bea.client.dto.virement.VirementSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.service.VirementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/virement")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VirementController {

	private final VirementService virementService;

	@GetMapping("/me/context")
	public ResponseEntity<VirementContextResponse> getContext(Authentication authentication) {
		return ResponseEntity.ok(virementService.getContext(getClient(authentication)));
	}

	@GetMapping("/me/orders")
	public ResponseEntity<List<VirementResponse>> getHistory(Authentication authentication) {
		return ResponseEntity.ok(virementService.getHistory(getClient(authentication)));
	}

	@GetMapping("/me/orders/{reference}")
	public ResponseEntity<VirementResponse> getOrder(Authentication authentication, @PathVariable String reference) {
		return ResponseEntity.ok(virementService.getOrder(getClient(authentication), reference));
	}

	@PostMapping
	public ResponseEntity<VirementResponse> submit(Authentication authentication, @RequestBody VirementSubmissionRequest request) {
		return ResponseEntity.ok(virementService.submit(getClient(authentication), request));
	}

	private Client getClient(Authentication authentication) {
		Object principal = authentication.getPrincipal();
		if (!(principal instanceof Client client)) {
			throw new IllegalStateException("Authenticated client not found");
		}
		return client;
	}
}
