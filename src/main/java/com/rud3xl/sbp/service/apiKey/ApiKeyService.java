package com.rud3xl.sbp.service.apiKey;

import com.rud3xl.sbp.domain.ApiKey;
import com.rud3xl.sbp.domain.Membership;
import com.rud3xl.sbp.domain.Organization;
import com.rud3xl.sbp.domain.enums.KeyStatus;
import com.rud3xl.sbp.domain.enums.OrganizationStatus;
import com.rud3xl.sbp.dto.apiKey.ApiKeyResponse;
import com.rud3xl.sbp.dto.apiKey.ApiKeyWithSecretResponse;
import com.rud3xl.sbp.dto.apiKey.CreateApiKeyRequest;
import com.rud3xl.sbp.exception.ResourceNotFoundException;
import com.rud3xl.sbp.mapper.ApiKeyMapper;
import com.rud3xl.sbp.repository.ApiKeyRepository;
import com.rud3xl.sbp.repository.MembershipRepository;
import com.rud3xl.sbp.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

import static com.rud3xl.sbp.security.HashUtils.hashSecretKey;

@Service
@RequiredArgsConstructor
public class ApiKeyService {
    private final ApiKeyRepository apiKeyRepository;
    private final ApiKeyMapper apiKeyMapper;
    private final OrganizationRepository organizationRepository;
    private final MembershipRepository membershipRepository;

    @Transactional
    public ApiKeyWithSecretResponse createApiKey(String slug, CreateApiKeyRequest request) {
        Organization organization = findActiveOrgBySlug(slug);

        try {
            String secretKey = generateSecretKey();
            String keyHash = hashSecretKey(secretKey);

            ApiKey apiKey = new ApiKey();
            apiKey.setOrganization(organization);
            apiKey.setName(request.getName());
            apiKey.setKeyHash(keyHash);
            apiKey.setStatus(KeyStatus.ACTIVE);

            ApiKey savedApiKey = apiKeyRepository.save(apiKey);

            ApiKeyWithSecretResponse response = new ApiKeyWithSecretResponse();
            response.setId(savedApiKey.getId());
            response.setName(savedApiKey.getName());
            response.setStatus(savedApiKey.getStatus());
            response.setSecretKey(secretKey);
            response.setCreatedAt(savedApiKey.getCreatedAt());

            return response;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating API key hash", e);
        }
    }

    private String generateSecretKey() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return "sk_live_" + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }


    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getAllApiKeys(String slug){
        Organization organization = findActiveOrgBySlug(slug);
        return apiKeyRepository.findAllByOrganizationId(organization.getId()).stream()
                .filter(key -> key.getStatus() == KeyStatus.ACTIVE)
                .map(apiKeyMapper::toDto)
                .toList();
    }

    @Transactional
    public void revokeApiKey(UUID apiKeyId, String slug){
        Organization organization = findActiveOrgBySlug(slug);
        ApiKey apiKey = apiKeyRepository.findByIdAndOrganizationId(apiKeyId, organization.getId())
                .orElseThrow(() -> new ResourceNotFoundException("API key not found in this organization"));

        if(apiKey.getStatus() == KeyStatus.ACTIVE) {
            apiKey.setStatus(KeyStatus.REVOKED);
            apiKeyRepository.save(apiKey);
        }
    }
    private Organization findActiveOrgBySlug(String slug) {
        return organizationRepository.findBySlug(slug)
                .filter(org -> org.getStatus() == OrganizationStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with slug: " + slug));
    }
}
