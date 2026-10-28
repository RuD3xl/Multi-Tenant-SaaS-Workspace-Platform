package com.rud3xl.sbp.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectRequest {
    @Size(min = 1, max = 100, message = "Project name must be between 1 and 100 characters long")
    private String name;

    @Size(max = 500, message = "Project description must be less than 500 characters long")
    private String description;
}
