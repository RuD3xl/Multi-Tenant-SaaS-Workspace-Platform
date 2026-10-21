package com.rud3xl.sbp.mapper;

import com.rud3xl.sbp.domain.ApiKey;
import com.rud3xl.sbp.dto.apiKey.ApiKeyResponse;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ApiKeyMapper {
    ApiKeyResponse toDto(ApiKey apiKey);
}
