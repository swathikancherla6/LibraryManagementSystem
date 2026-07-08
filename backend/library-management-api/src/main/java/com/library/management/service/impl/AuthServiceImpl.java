package com.library.management.service.impl;

import com.library.management.dto.request.LoginRequest;
import com.library.management.dto.request.RegisterRequest;
import com.library.management.dto.request.UpdateProfileRequest;
import com.library.management.dto.response.AuthResponse;
import com.library.management.dto.response.UserResponse;
import com.library.management.entity.Member;
import com.library.management.entity.Role;
import com.library.management.entity.User;
import com.library.management.enums.RoleType;
import com.library.management.exception.BadRequestException;
import com.library.management.mapper.UserMapper;
import com.library.management.repository.MemberRepository;
import com.library.management.repository.RoleRepository;
import com.library.management.repository.UserRepository;
import com.library.management.security.JwtTokenProvider;
import com.library.management.service.AuthService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        Role memberRole = roleRepository.findByName(RoleType.MEMBER)
                .orElseThrow(() -> new BadRequestException("MEMBER role not found"));

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .roles(Set.of(memberRole))
                .build();

        user = userRepository.save(user);

        memberRepository.save(Member.builder()
                .user(user)
                .membershipNumber("MEM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .membershipType("STANDARD")
                .joinedDate(LocalDate.now())
                .build());

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities("ROLE_MEMBER")
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);
        return UserMapper.toAuthResponse(user, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .authorities(user.getRoles().stream()
                        .map(r -> "ROLE_" + r.getName().name())
                        .toArray(String[]::new))
                .build();

        String token = jwtTokenProvider.generateToken(userDetails);
        return UserMapper.toAuthResponse(user, token);
    }

    @Override
    public UserResponse getCurrentUserProfile() {
        return UserMapper.toResponse(securityUtils.getCurrentUser());
    }

    @Override
    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = securityUtils.getCurrentUser();
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        return UserMapper.toResponse(userRepository.save(user));
    }
}
