package com.rud3xl.sbp.security.api;

import com.rud3xl.sbp.domain.ApiKey;
import org.jspecify.annotations.Nullable;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.Collections;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {
    private String rawApiKey;
    private ApiKey apiKeyEntity;

    public ApiKeyAuthenticationToken(String rawApiKey) {
        super(Collections.emptyList());
        this.rawApiKey = rawApiKey;
        this.apiKeyEntity = null;
        setAuthenticated(false);
    }

    public ApiKeyAuthenticationToken(String rawApiKey, ApiKey apiKey, Collection<? extends GrantedAuthority> authorities){
        super(authorities);
        this.rawApiKey = rawApiKey;
        this.apiKeyEntity = apiKey;
        setAuthenticated(true);
    }

    @Override
    public @Nullable Object getCredentials() {
        return rawApiKey;
    }

    @Override
    public @Nullable Object getPrincipal() {
        return apiKeyEntity;
    }
}
