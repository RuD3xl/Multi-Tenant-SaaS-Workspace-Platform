package com.rud3xl.sbp.dto.organization;

import com.rud3xl.sbp.domain.enums.OrganizationRole;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WorkspaceInviteResponse {
    private String orgName;
    private String orgSlug;
    private OrganizationRole role;
}