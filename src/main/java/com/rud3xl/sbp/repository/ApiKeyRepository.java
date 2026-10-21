package com.rud3xl.sbp.repository;

import com.rud3xl.sbp.domain.ApiKey;
import com.rud3xl.sbp.domain.enums.KeyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {
    List<ApiKey> findAllByOrganizationId(UUID organizationId);
    Optional<ApiKey> findByIdAndOrganizationId(UUID id, UUID organizationId);
    Optional<ApiKey> findByKeyHashAndStatus(String keyHash, KeyStatus status);
}

