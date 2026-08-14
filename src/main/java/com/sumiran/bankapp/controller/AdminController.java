package com.sumiran.bankapp.controller;

import com.sumiran.bankapp.dto.account.AccountResponse;
import com.sumiran.bankapp.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/accounts")
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        return ResponseEntity.ok(adminService.getAllAccounts());
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/accounts/{accountNumber}/block")
    public ResponseEntity<AccountResponse> blockAccount(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(adminService.blockAccount(accountNumber));
    }

    @PutMapping("/accounts/{accountNumber}/unblock")
    public ResponseEntity<AccountResponse> unblockAccount(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(adminService.unblockAccount(accountNumber));
    }
}