package com.rud3xl.sbp.controller;

import com.rud3xl.sbp.domain.enums.ProjectStatus;
import com.rud3xl.sbp.dto.project.CreateProjectRequest;
import com.rud3xl.sbp.dto.project.ProjectResponse;
import com.rud3xl.sbp.dto.project.UpdateProjectRequest;
import com.rud3xl.sbp.service.projects.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orgs/{slug}/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping()
    public ResponseEntity<ProjectResponse> createProject(
            @RequestBody @Valid CreateProjectRequest createProjectRequest,
            @PathVariable("slug") String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        return ResponseEntity.status(201).body(projectService.createProject(slug, createProjectRequest, userDetails.getUsername()));
    }

    @GetMapping()
    public ResponseEntity<Page<ProjectResponse>> getAllProjects(
            @PathVariable("slug") String slug,
            @RequestParam(required = false) ProjectStatus status,
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable
    ){
        Page<ProjectResponse> projects = projectService.getAllProjects(
                slug,
                userDetails.getUsername(),
                status,
                pageable
        );
        return ResponseEntity.status(200).body(projects);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> getProjectById(
            @PathVariable("slug") String slug,
            @PathVariable("projectId") UUID projectId,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        ProjectResponse response = projectService.getProjectById(slug, userDetails.getUsername(), projectId);
        return ResponseEntity.status(200).body(response);
    }


    @PatchMapping("/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(
            @RequestBody @Valid UpdateProjectRequest updateProjectRequest,
            @PathVariable("slug") String slug,
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable("projectId") UUID projectId
    ){
        ProjectResponse response = projectService.updateProject(slug, updateProjectRequest, userDetails.getUsername(), projectId);
        return ResponseEntity.status(200).body(response);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable("slug") String slug,
            @PathVariable("projectId") UUID projectId,
            @AuthenticationPrincipal UserDetails userDetails
    ){
        projectService.deleteProject(slug, userDetails.getUsername(), projectId);
        return ResponseEntity.status(204).build();
    }
}
