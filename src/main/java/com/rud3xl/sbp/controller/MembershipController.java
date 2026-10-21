package com.rud3xl.sbp.controller;

import com.rud3xl.sbp.dto.organization.AddMemberRequest;
import com.rud3xl.sbp.dto.organization.MemberResponse;
import com.rud3xl.sbp.dto.organization.UpdateMemberRoleRequest;
import com.rud3xl.sbp.service.organizations.MembershipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orgs/{slug}/members")
@RequiredArgsConstructor
public class MembershipController {
    private final MembershipService membershipService;

    @GetMapping
    public ResponseEntity<List<MemberResponse>> getOrganizationMemberships(
            @PathVariable("slug") String slug,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<MemberResponse> memberResponses = membershipService.getOrganizationMembers(slug, userDetails.getUsername());
        return ResponseEntity.ok(memberResponses);
    }

    @PostMapping
    public ResponseEntity<MemberResponse> inviteMember(
            @PathVariable("slug") String slug,
            @RequestBody @Valid AddMemberRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        MemberResponse response = membershipService.addMember(slug, userDetails.getUsername(), request.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<MemberResponse> updateMemberRole(
            @PathVariable("slug") String slug,
            @PathVariable("userId") UUID userId,
            @RequestBody @Valid UpdateMemberRoleRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        MemberResponse response = membershipService.updateMemberRole(slug, userDetails.getUsername(), userId, request.getRole());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable("slug") String slug,
            @PathVariable("userId") UUID userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        membershipService.removeMember(slug, userDetails.getUsername(), userId);
        return ResponseEntity.noContent().build();
    }
}