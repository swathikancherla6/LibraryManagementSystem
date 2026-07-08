package com.library.management.service.impl;

import com.library.management.dto.request.UpdateUserRolesRequest;
import com.library.management.dto.response.PageResponse;
import com.library.management.dto.response.UserResponse;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.UserMapper;
import com.library.management.repository.RoleRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.UserService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public PageResponse<UserResponse> getAllUsers(int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending());
        return SecurityUtils.toPageResponse(userRepository.findAll(pageable).map(UserMapper::toResponse));
    }

    @Override
    @Transactional
    public UserResponse updateUserRoles(Long userId, UpdateUserRolesRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Role> roles = new HashSet<>();
        request.getRoles().forEach(roleType ->
                roleRepository.findByName(roleType).ifPresent(roles::add));
        user.setRoles(roles);

        return UserMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(active);
        return UserMapper.toResponse(userRepository.save(user));
    }
}
