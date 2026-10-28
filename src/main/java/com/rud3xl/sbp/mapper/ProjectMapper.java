package com.rud3xl.sbp.mapper;

import com.rud3xl.sbp.domain.Project;
import com.rud3xl.sbp.dto.project.ProjectResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface ProjectMapper {
    ProjectResponse toDto(Project project);
}
