package com.sumiran.bankapp.config;

import com.sumiran.bankapp.entity.User;
import com.sumiran.bankapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {
        String adminEmail = "admin@bankapp.com";

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin account already exists — skipping creation");
            return;
        }

        User admin = User.builder()
                .fullName("BankApp Admin")
                .email(adminEmail)
                .password(passwordEncoder.encode("Admin@123"))
                .phone("0000000000")
                .address("BankApp HQ")
                .role("ROLE_ADMIN")
                .isActive(true)
                .build();

        userRepository.save(admin);
        log.info("Admin account created: {}", adminEmail);
    }
}