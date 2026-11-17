package com.rud3xl.sbp.controller;

import com.rud3xl.sbp.dto.organization.WorkspaceInviteResponse;
import com.rud3xl.sbp.dto.user.UpdateUserRequest;
import com.rud3xl.sbp.dto.user.UserResponse;
import com.rud3xl.sbp.service.UserService;
import com.rud3xl.sbp.service.organizations.MembershipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final MembershipService membershipService;

    @GetMapping("/me")
    public UserResponse getProfile(@AuthenticationPrincipal UserDetails userDetails){
        return userService.getUserByEmail(userDetails.getUsername());
    }

    @PatchMapping("/me")
    public UserResponse updateUser(@AuthenticationPrincipal UserDetails userDetails,@RequestBody @Valid UpdateUserRequest userRequest){
        return userService.updateUser(userDetails.getUsername(),userRequest);
    }

    @GetMapping("/me/invites")
    public List<WorkspaceInviteResponse> getMyInvites(@AuthenticationPrincipal UserDetails userDetails){
        return membershipService.getMyInvitations(userDetails.getUsername());
    }
}
