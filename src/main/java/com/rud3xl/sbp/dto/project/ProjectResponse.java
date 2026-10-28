package com.rud3xl.sbp.dto.project;

import com.rud3xl.sbp.domain.enums.ProjectStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private UUID id;
    private String name;
    private String description;
    private ProjectStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
