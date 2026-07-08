package com.library.management.service;

import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.RegisterRequest;
import com.library.management.dto.request.UpdateProfileRequest;
import com.library.management.dto.response.AuthResponse;
import com.library.management.dto.response.UserResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserResponse getCurrentUserProfile();
    UserResponse updateProfile(UpdateProfileRequest request);
}
