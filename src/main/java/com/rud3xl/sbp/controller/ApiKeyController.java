package com.rud3xl.sbp.controller;

import com.rud3xl.sbp.domain.Organization;
import com.rud3xl.sbp.dto.apiKey.ApiKeyResponse;
import com.rud3xl.sbp.dto.apiKey.ApiKeyWithSecretResponse;
import com.rud3xl.sbp.dto.apiKey.CreateApiKeyRequest;
import com.rud3xl.sbp.security.context.CurrentOrg;
import com.rud3xl.sbp.service.apiKey.ApiKeyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orgs/{slug}/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {
    private final ApiKeyService apiKeyService;

    @PostMapping()
    public ResponseEntity<ApiKeyWithSecretResponse> createApiKey(@Valid @RequestBody CreateApiKeyRequest request, @PathVariable("slug") String slug){
        return ResponseEntity.status(HttpStatus.CREATED).body(apiKeyService.createApiKey(slug, request));
    }

    @GetMapping()
    public ResponseEntity<List<ApiKeyResponse>> getAllApiKeys(@PathVariable("slug") String slug){
        return ResponseEntity.ok(apiKeyService.getAllApiKeys(slug));
    }

    @DeleteMapping("/{apiKeyId}")
    public ResponseEntity<Void> revokeApiKey(@PathVariable UUID apiKeyId, @PathVariable("slug") String slug){
        apiKeyService.revokeApiKey(apiKeyId, slug);
        return ResponseEntity.noContent().build();
    }
}
