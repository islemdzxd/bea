package com.bea.client.service;

import com.bea.client.dto.ChangePasswordRequest;
import com.bea.client.model.Client;
import com.bea.client.repository.ClientRepository;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PasswordService {

	private final ClientRepository clientRepository;
	private final PasswordEncoder passwordEncoder;

	@Transactional
	public void changePassword(Client client, ChangePasswordRequest request) {
		if (client == null) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Utilisateur non authentifié");
		}

		if (request == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Données de mot de passe invalides");
		}

		if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is required");
		}

		if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password is required");
		}

		if (request.getConfirmPassword() == null || request.getConfirmPassword().isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please confirm your password");
		}

		if (!request.getNewPassword().equals(request.getConfirmPassword())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Passwords do not match");
		}

		if (request.getNewPassword().length() < 8) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 8 characters");
		}

		if (request.getCurrentPassword().equals(request.getNewPassword())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different from current password");
		}

		Client storedClient = clientRepository.findByCli(client.getCli())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client not found"));

		if (storedClient.getPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), storedClient.getPassword())) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
		}

		storedClient.setPassword(passwordEncoder.encode(request.getNewPassword()));
		clientRepository.save(storedClient);
	}
}
