package com.rud3xl.sbp.service.projects;

import com.rud3xl.sbp.domain.Membership;
import com.rud3xl.sbp.domain.Organization;
import com.rud3xl.sbp.domain.Project;
import com.rud3xl.sbp.domain.enums.MembershipStatus;
import com.rud3xl.sbp.domain.enums.OrganizationRole;
import com.rud3xl.sbp.domain.enums.OrganizationStatus;
import com.rud3xl.sbp.domain.enums.ProjectStatus;
import com.rud3xl.sbp.dto.project.CreateProjectRequest;
import com.rud3xl.sbp.dto.project.ProjectResponse;
import com.rud3xl.sbp.dto.project.UpdateProjectRequest;
import com.rud3xl.sbp.exception.ResourceExistsException;
import com.rud3xl.sbp.exception.ResourceNotFoundException;
import com.rud3xl.sbp.mapper.ProjectMapper;
import com.rud3xl.sbp.repository.MembershipRepository;
import com.rud3xl.sbp.repository.OrganizationRepository;
import com.rud3xl.sbp.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectMapper projectMapper;
    private final OrganizationRepository organizationRepository;
    private final MembershipRepository membershipRepository;

    @Transactional
    public ProjectResponse createProject(String slug, CreateProjectRequest request, String userEmail){
        Organization organization = findActiveOrgBySlug(slug);
        Membership membership = getRequesterMembership(userEmail, organization);
        isAllowedToInteractWithProject(membership);
        if (projectRepository.existsByNameAndOrganizationId(request.getName(), organization.getId())) {
            throw new ResourceExistsException("Project with name " + request.getName() + " already exists in this organization.");
        }
        Project project = Project.builder()
                .name(request.getName())
                .organization(organization)
                .status(ProjectStatus.ACTIVE)
                .build();
        projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    @Transactional(readOnly = true)
    public Page<ProjectResponse> getAllProjects(String slug, String email, ProjectStatus status, Pageable pageable) {
        Organization organization = findActiveOrgBySlug(slug);
        getRequesterMembership(email, organization);

        Page<Project> projectsPage;
        if (status == null) {
            projectsPage = projectRepository.findAllByOrganizationId(organization.getId(), pageable);
        } else {
            projectsPage = projectRepository.findAllByOrganizationIdAndStatus(organization.getId(), status, pageable);
        }

        return projectsPage.map(projectMapper::toDto);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(String slug, String email, UUID projectId){
        Organization organization = findActiveOrgBySlug(slug);
        getRequesterMembership(email, organization);
        return projectRepository.findByIdAndOrganizationId(projectId, organization.getId())
                .map(projectMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
    }

    @Transactional
    public ProjectResponse updateProject(String slug, UpdateProjectRequest request, String userEmail, UUID projectId){
        Organization organization = findActiveOrgBySlug(slug);
        Membership membership = getRequesterMembership(userEmail, organization);
        isAllowedToInteractWithProject(membership);

        Project project = projectRepository.findByIdAndOrganizationId(projectId, organization.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        if (project.getStatus() == ProjectStatus.ARCHIVED) {
            throw new AccessDeniedException("Cannot modify an archived project");
        }
        if(request.getName() != null && !request.getName().isBlank()){
            project.setName(request.getName());
        }
        if(request.getDescription() != null){
            project.setDescription(request.getDescription());
        }

        projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    @Transactional
    public void deleteProject(String slug, String userEmail, UUID projectId){
        Organization organization = findActiveOrgBySlug(slug);
        Membership membership = getRequesterMembership(userEmail, organization);
        isAllowedToInteractWithProject(membership);

        Project project = projectRepository.findByIdAndOrganizationId(projectId, organization.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if(project.getStatus() == ProjectStatus.ACTIVE){
            project.setStatus(ProjectStatus.ARCHIVED);
        }
        projectRepository.save(project);

    }

    private Organization findActiveOrgBySlug(String slug) {
        return organizationRepository.findBySlug(slug)
                .filter(org -> org.getStatus() == OrganizationStatus.ACTIVE)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found with slug: " + slug));
    }

    private Membership getRequesterMembership(String email, Organization organization) {
        return membershipRepository.findByUserEmailAndOrganizationId(email, organization.getId())
                .filter(m -> m.getStatus() == MembershipStatus.ACTIVE)
                .orElseThrow(() -> new AccessDeniedException("User is not an active member of this organization"));
    }
    private void isAllowedToInteractWithProject(Membership membership){
        if (membership.getRole() == OrganizationRole.VIEWER || membership.getRole() == OrganizationRole.BILLING_MANAGER) {
            throw new AccessDeniedException("User is not allowed to interact with projects");
        }
    }

}
