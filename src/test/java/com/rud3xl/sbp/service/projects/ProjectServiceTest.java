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
import com.rud3xl.sbp.exception.ResourceExistsException;
import com.rud3xl.sbp.exception.ResourceNotFoundException;
import com.rud3xl.sbp.mapper.ProjectMapper;
import com.rud3xl.sbp.repository.MembershipRepository;
import com.rud3xl.sbp.repository.OrganizationRepository;
import com.rud3xl.sbp.repository.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;


import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private ProjectMapper projectMapper;
    @Mock
    private OrganizationRepository organizationRepository;
    @Mock
    private MembershipRepository membershipRepository;
    @InjectMocks
    private ProjectService projectService;

    @Test
    void getProjectById_ShouldReturnProject_WhenEverythingIsValid() {
        String slug = "test-org";
        String email = "user@test.com";
        UUID orgId = UUID.randomUUID();
        UUID projectId = UUID.randomUUID();

        Organization fakeOrg = new Organization();
        fakeOrg.setId(orgId);
        fakeOrg.setStatus(OrganizationStatus.ACTIVE);

        Membership fakeMembership = new Membership();
        fakeMembership.setStatus(MembershipStatus.ACTIVE);
        fakeMembership.setRole(OrganizationRole.MEMBER);

        Project fakeProject = new Project();
        fakeProject.setId(projectId);
        fakeProject.setName("Secret Project");

        ProjectResponse fakeResponse = ProjectResponse.builder()
                .id(projectId)
                .name("Secret Project")
                .build();

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));
        when(membershipRepository.findByUserEmailAndOrganizationId(email, orgId)).thenReturn(Optional.of(fakeMembership));
        when(projectRepository.findByIdAndOrganizationId(projectId, orgId)).thenReturn(Optional.of(fakeProject));
        when(projectMapper.toDto(fakeProject)).thenReturn(fakeResponse);

        ProjectResponse actualResponse = projectService.getProjectById(slug, email, projectId);

        assertNotNull(actualResponse, "Response should not be null");
        assertEquals("Secret Project", actualResponse.getName(), "Names should match");

        verify(projectRepository, times(1)).findByIdAndOrganizationId(projectId, orgId);
    }

    @Test
    void getProjectById_ShouldThrowException_WhenOrganizationIsSuspended() {
        String slug = "blocked-org";
        Organization fakeOrg = new Organization();
        fakeOrg.setStatus(OrganizationStatus.SUSPENDED);

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));

        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            projectService.getProjectById(slug, "user@test.com", UUID.randomUUID());
        });

        assertEquals("Organization not found with slug: blocked-org", exception.getMessage());

        verify(projectRepository, never()).findByIdAndOrganizationId(any(), any());
    }

    @Test
    void createProject_ShouldSaveAndReturnProject_WhenUserIsMemberOrHigher(){
        String slug = "test-org";
        String email = "test-email";
        UUID orgId = UUID.randomUUID();

        CreateProjectRequest request = CreateProjectRequest.builder()
                .name("Test Project")
                .description("This is a test project")
                .build();

        Organization fakeOrg = new Organization();
        fakeOrg.setId(orgId);
        fakeOrg.setStatus(OrganizationStatus.ACTIVE);

        Membership fakeMembership = new Membership();
        fakeMembership.setStatus(MembershipStatus.ACTIVE);
        fakeMembership.setRole(OrganizationRole.MEMBER);

        ProjectResponse projectResponse = ProjectResponse.builder()
                .name("Test Project")
                .status(ProjectStatus.ACTIVE)
                .build();

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));
        when(membershipRepository.findByUserEmailAndOrganizationId(email, orgId)).thenReturn(Optional.of(fakeMembership));
        when(projectRepository.existsByNameAndOrganizationId(request.getName(), orgId)).thenReturn(false);
        when(projectMapper.toDto(any(Project.class))).thenReturn(projectResponse);


        ProjectResponse actualResponse = projectService.createProject(slug, request, email);

        assertNotNull(actualResponse, "Response should not be null");
        assertEquals("Test Project", actualResponse.getName(), "Names should match");

        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_ShouldThrowException_WhenProjectNameAlreadyExists(){
        String slug = "test-org";
        String email = "test-email";
        UUID orgId = UUID.randomUUID();
        CreateProjectRequest request = new CreateProjectRequest("Duplicate name", "Description");

        Organization fakeOrg = new Organization();
        fakeOrg.setId(orgId);
        fakeOrg.setStatus(OrganizationStatus.ACTIVE);

        Membership fakeMembership = new Membership();
        fakeMembership.setStatus(MembershipStatus.ACTIVE);
        fakeMembership.setRole(OrganizationRole.MEMBER);

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));
        when(membershipRepository.findByUserEmailAndOrganizationId(email, orgId)).thenReturn(Optional.of(fakeMembership));
        when(projectRepository.existsByNameAndOrganizationId("Duplicate name", orgId)).thenReturn(true);

        assertThrows(ResourceExistsException.class, () -> {projectService.createProject(slug, request, email);});

        verify(projectRepository, never()).save(any(Project.class));
    }

    @Test
    void createProject_ShouldThrowAccessDenied(){
        String slug = "test-org";
        String emailDenied = "test-email";
        UUID orgId = UUID.randomUUID();
        CreateProjectRequest request = new CreateProjectRequest("Duplicate name", "Description");

        Organization fakeOrg = new Organization();
        fakeOrg.setId(orgId);
        fakeOrg.setStatus(OrganizationStatus.ACTIVE);

        Membership fakeMembershipRemoved = new Membership();
        fakeMembershipRemoved.setStatus(MembershipStatus.REMOVED);
        fakeMembershipRemoved.setRole(OrganizationRole.MEMBER);

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));
        when(membershipRepository.findByUserEmailAndOrganizationId(emailDenied, orgId)).thenReturn(Optional.of(fakeMembershipRemoved));

        assertThrows(AccessDeniedException.class, () -> {projectService.createProject(slug, request, emailDenied);});

        verify(projectRepository, never()).save(any(Project.class));
    }


    @Test
    void createProject_ShouldThrowException_WhenUserIsNotMemberOrHigher(){
        String slug = "test-org";
        String email = "test-email";
        UUID orgId = UUID.randomUUID();
        CreateProjectRequest request = new CreateProjectRequest("Duplicate name", "Description");

        Organization fakeOrg = new Organization();
        fakeOrg.setId(orgId);
        fakeOrg.setStatus(OrganizationStatus.ACTIVE);

        Membership fakeMembership = new Membership();
        fakeMembership.setStatus(MembershipStatus.ACTIVE);
        fakeMembership.setRole(OrganizationRole.VIEWER);

        when(organizationRepository.findBySlug(slug)).thenReturn(Optional.of(fakeOrg));
        when(membershipRepository.findByUserEmailAndOrganizationId(email, orgId)).thenReturn(Optional.of(fakeMembership));

        assertThrows(AccessDeniedException.class, () -> {projectService.createProject(slug, request, email);});

        verify(projectRepository, never()).save(any(Project.class));
    }



}
