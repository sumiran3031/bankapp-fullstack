package com.sumiran.bankapp.controller;

import com.sumiran.bankapp.dto.account.*;
import com.sumiran.bankapp.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    // Open new account
    @PostMapping("/open")
    public ResponseEntity<AccountResponse> openAccount(
            @Valid @RequestBody AccountRequest request,
            Authentication auth) {
        return ResponseEntity.ok(
                accountService.openAccount(auth.getName(), request));
    }

    // Get my accounts
    @GetMapping("/my")
    public ResponseEntity<List<AccountResponse>> getMyAccounts(
            Authentication auth) {
        return ResponseEntity.ok(
                accountService.getMyAccounts(auth.getName()));
    }

    // Get account by number
    @GetMapping("/{accountNumber}")
    public ResponseEntity<AccountResponse> getAccount(
            @PathVariable String accountNumber) {
        return ResponseEntity.ok(
                accountService.getAccountByNumber(accountNumber));
    }

    // Close account
    @PutMapping("/{accountNumber}/close")
    public ResponseEntity<AccountResponse> closeAccount(
            @PathVariable String accountNumber,
            Authentication auth) {
        return ResponseEntity.ok(
                accountService.closeAccount(accountNumber, auth.getName()));
    }
}