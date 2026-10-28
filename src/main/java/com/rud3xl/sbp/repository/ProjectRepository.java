package com.rud3xl.sbp.repository;

import com.rud3xl.sbp.domain.Project;
import com.rud3xl.sbp.domain.enums.ProjectStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Optional<Project> findByIdAndOrganizationId(UUID id, UUID organizationId);
    Page<Project> findAllByOrganizationId(UUID organizationId, Pageable pageable);
    Page<Project> findAllByOrganizationIdAndStatus(UUID organizationId, ProjectStatus status, Pageable pageable);
    boolean existsByNameAndOrganizationId(String name, UUID organizationId);
}
