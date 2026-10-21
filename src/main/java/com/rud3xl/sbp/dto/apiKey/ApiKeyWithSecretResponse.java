package com.rud3xl.sbp.dto.apiKey;

import com.rud3xl.sbp.domain.enums.KeyStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ApiKeyWithSecretResponse {
    private UUID id;
    private String name;
    private KeyStatus status;
    private String secretKey;
    private LocalDateTime createdAt;
}
