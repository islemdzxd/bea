package com.bea.client.controller;

import com.bea.client.dto.allocation.AllocationContextResponse;
import com.bea.client.dto.allocation.AllocationRequestResponse;
import com.bea.client.dto.allocation.AllocationSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.service.AllocationService;
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
@RequestMapping("/api/allocation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AllocationController {

	private final AllocationService allocationService;

	@GetMapping("/me/context")
	public ResponseEntity<AllocationContextResponse> getContext(Authentication authentication) {
		Client client = getClient(authentication);
		return ResponseEntity.ok(allocationService.getContext(client));
	}

	@GetMapping("/me/requests")
	public ResponseEntity<List<AllocationRequestResponse>> getHistory(Authentication authentication) {
		Client client = getClient(authentication);
		return ResponseEntity.ok(allocationService.getHistory(client));
	}

	@GetMapping("/me/requests/{codeDeclaration}")
	public ResponseEntity<AllocationRequestResponse> getRequest(Authentication authentication,
															   @PathVariable String codeDeclaration) {
		Client client = getClient(authentication);
		return ResponseEntity.ok(allocationService.getRequest(client, codeDeclaration));
	}

	@GetMapping("/eligible-clis")
	public ResponseEntity<List<String>> getCliWithoutAllocationThisYear() {
		return ResponseEntity.ok(allocationService.getCliWithoutAllocationThisYear());
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<AllocationRequestResponse> submit(Authentication authentication,
															@ModelAttribute AllocationSubmissionRequest request) {
		Client client = getClient(authentication);
		return ResponseEntity.ok(allocationService.submit(client, request));
	}

	private Client getClient(Authentication authentication) {
		Object principal = authentication.getPrincipal();
		if (!(principal instanceof Client client)) {
			throw new IllegalStateException("Authenticated client not found");
		}
		return client;
	}
}
