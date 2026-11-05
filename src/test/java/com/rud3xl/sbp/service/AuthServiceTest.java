package com.rud3xl.sbp.service;


import com.rud3xl.sbp.domain.UserEntity;
import com.rud3xl.sbp.dto.auth.AuthResponse;
import com.rud3xl.sbp.dto.auth.LoginRequest;
import com.rud3xl.sbp.dto.auth.RegisterRequest;
import com.rud3xl.sbp.exception.ResourceExistsException;
import com.rud3xl.sbp.repository.UserRepository;
import com.rud3xl.sbp.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;


@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @InjectMocks
    private AuthService authService;

    @Test
    void register_ShouldCreateUserAndReturnToken_WhenEverythingIsValid(){
        String email = "test-email";
        String password = "test-password";
        String hashedPassword = "hashed-password";
        String name = "test-name";
        String token = "fake-jwt-token";

        when(userRepository.existsByEmail(email)).thenReturn(false);
        when(passwordEncoder.encode(password)).thenReturn(hashedPassword);
        when(jwtService.generateToken(any())).thenReturn(token);

        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword(password);
        request.setFullName(name);

        AuthResponse actualResponse = authService.register(request);

        assertNotNull(actualResponse, "Response should not be null");
        assertEquals(token, actualResponse.getToken(), "Tokens should match");

        verify(userRepository, times(1)).save(any(UserEntity.class));
    }

    @Test
    void register_ShouldThrowException_WhenEmailAlreadyExists(){
        String email = "test-email";
        String name = "test-name";

        RegisterRequest request = new RegisterRequest();
        request.setEmail(email);
        request.setPassword("hashed-password");
        request.setFullName(name);

        when(userRepository.existsByEmail(email)).thenReturn(true);

        assertThrows(ResourceExistsException.class, () -> {authService.register(request);});

        verify(userRepository, never()).save(any());
        verify(jwtService, never()).generateToken(any());
    }

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid(){
        String email = "test-email";
        String password = "test-password";
        String hashed_db_password = "hashed-password";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(email);
        userEntity.setPasswordHash(hashed_db_password);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.matches(loginRequest.getPassword(), hashed_db_password)).thenReturn(true);
        when(jwtService.generateToken(userEntity)).thenReturn("login-token");

        AuthResponse actualResponse = authService.login(loginRequest);

        assertNotNull(actualResponse, "Response should not be null");
        assertEquals("login-token", actualResponse.getToken(), "Tokens should match");

        verify(userRepository, times(1)).findByEmail(email);
        verify(passwordEncoder, times(1)).matches(loginRequest.getPassword(), hashed_db_password);
        verify(jwtService, times(1)).generateToken(userEntity);
    }

    @Test
    void login_ShouldThrowException_WhenCredentialsAreInvalid(){
        String email = "test-email";
        String password = "test-password";
        String hashed_db_password = "hashed-password";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(email);
        userEntity.setPasswordHash(hashed_db_password);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.matches(loginRequest.getPassword(), hashed_db_password)).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {authService.login(loginRequest);});

        verify(jwtService, never()).generateToken(userEntity);
    }

    @Test
    void login_ShouldThrowException_WhenUserDoesNotExist(){
        String email = "test-email";
        String password = "test-password";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () -> {authService.login(loginRequest);});

        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(any());
    }
}
