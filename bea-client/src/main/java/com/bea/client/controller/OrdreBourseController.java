package com.bea.client.controller;

import com.bea.client.dto.ordrebourse.OrdreBourseContextResponse;
import com.bea.client.dto.ordrebourse.OrdreBourseResponse;
import com.bea.client.dto.ordrebourse.OrdreBourseSubmissionRequest;
import com.bea.client.model.Client;
import com.bea.client.service.OrdreBourseService;
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
@RequestMapping("/api/bourse")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrdreBourseController {

	private final OrdreBourseService ordreBourseService;

	@GetMapping("/me/context")
	public ResponseEntity<OrdreBourseContextResponse> getContext(Authentication authentication) {
		return ResponseEntity.ok(ordreBourseService.getContext(getClient(authentication)));
	}

	@GetMapping("/me/orders")
	public ResponseEntity<List<OrdreBourseResponse>> getHistory(Authentication authentication) {
		return ResponseEntity.ok(ordreBourseService.getHistory(getClient(authentication)));
	}

	@GetMapping("/me/orders/{reference}")
	public ResponseEntity<OrdreBourseResponse> getOrder(Authentication authentication, @PathVariable String reference) {
		return ResponseEntity.ok(ordreBourseService.getOrder(getClient(authentication), reference));
	}

	@PostMapping
	public ResponseEntity<OrdreBourseResponse> submit(Authentication authentication, @RequestBody OrdreBourseSubmissionRequest request) {
		return ResponseEntity.ok(ordreBourseService.submit(getClient(authentication), request));
	}

	private Client getClient(Authentication authentication) {
		Object principal = authentication.getPrincipal();
		if (!(principal instanceof Client client)) {
			throw new IllegalStateException("Authenticated client not found");
		}
		return client;
	}
}
