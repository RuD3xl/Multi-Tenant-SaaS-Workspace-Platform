package com.rud3xl.sbp.domain;

import com.rud3xl.sbp.domain.enums.KeyStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "api_keys")
public class ApiKey extends AbstractEntity{
    @JoinColumn(name = "organization_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Organization organization;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String keyHash;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private KeyStatus status;

    private LocalDateTime lastUsedAt;
}
