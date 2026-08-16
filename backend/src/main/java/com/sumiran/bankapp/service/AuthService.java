package com.sumiran.bankapp.service;

import com.sumiran.bankapp.dto.auth.*;
import com.sumiran.bankapp.entity.PasswordResetToken;
import com.sumiran.bankapp.entity.User;
import com.sumiran.bankapp.repository.PasswordResetTokenRepository;
import com.sumiran.bankapp.repository.UserRepository;
import com.sumiran.bankapp.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    // ─────────────────────────────────────────────────────────
    // REGISTER
    // ─────────────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (userRepository.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .address(request.getAddress())
                .role("ROLE_CUSTOMER")
                .isActive(true)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Registration successful! Welcome to BankApp.")
                .build();
    }

    // ─────────────────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            throw new RuntimeException(
                    "Account is deactivated. Contact support.");
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .message("Login successful!")
                .build();
    }

    // ─────────────────────────────────────────────────────────
    // FORGOT PASSWORD
    // ─────────────────────────────────────────────────────────
    public void forgotPassword(ForgotPasswordRequest request) {

        userRepository.findByEmail(request.getEmail())
                .ifPresent(user -> {

                    // Delete previous reset token if one exists
                    passwordResetTokenRepository.deleteByUser(user);

                    // Generate a unique reset token
                    String token = UUID.randomUUID().toString();

                    PasswordResetToken resetToken =
                            PasswordResetToken.builder()
                                    .token(token)
                                    .user(user)
                                    .expiryDate(
                                            LocalDateTime.now()
                                                    .plusMinutes(15)
                                    )
                                    .used(false)
                                    .build();

                    passwordResetTokenRepository.save(resetToken);

                    // Link sent to user's email
                    String resetLink =
                            "https://bankapp.sumiranpaparkar.me/reset-password?token="
                                    + token;

                    emailService.sendPasswordResetEmail(
                            user.getEmail(),
                            resetLink
                    );
                });
    }

    // ─────────────────────────────────────────────────────────
    // RESET PASSWORD
    // ─────────────────────────────────────────────────────────
    public void resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.getToken())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid or expired reset token"
                                )
                        );

        if (resetToken.isUsed()) {
            throw new RuntimeException(
                    "Reset token has already been used"
            );
        }

        if (resetToken.isExpired()) {
            throw new RuntimeException(
                    "Reset token has expired"
            );
        }

        User user = resetToken.getUser();

        // Encode the new password using BCrypt
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user);

        // Make token unusable after successful reset
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }
}