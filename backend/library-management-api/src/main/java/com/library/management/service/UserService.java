package com.library.management.service;

import com.library.management.dto.request.UpdateUserRolesRequest;
import com.library.management.dto.response.PageResponse;
import com.library.management.dto.response.UserResponse;

public interface UserService {
    PageResponse<UserResponse> getAllUsers(int page, int size);
    UserResponse updateUserRoles(Long userId, UpdateUserRolesRequest request);
    UserResponse updateUserStatus(Long userId, boolean active);
}
