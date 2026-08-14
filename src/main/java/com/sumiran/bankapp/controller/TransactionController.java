package com.sumiran.bankapp.controller;

import com.sumiran.bankapp.dto.transaction.*;
import com.sumiran.bankapp.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // Deposit
    @PostMapping("/deposit")
    public ResponseEntity<TransactionResponse> deposit(
            @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(transactionService.deposit(request));
    }

    // Withdraw
    @PostMapping("/withdraw")
    public ResponseEntity<TransactionResponse> withdraw(
            @Valid @RequestBody WithdrawRequest request,
            Authentication auth) {
        return ResponseEntity.ok(
                transactionService.withdraw(request, auth.getName()));
    }

    // Transfer
    @PostMapping("/transfer")
    public ResponseEntity<Map<String, TransactionResponse>> transfer(
            @Valid @RequestBody TransferRequest request,
            Authentication auth) {
        return ResponseEntity.ok(
                transactionService.transfer(request, auth.getName()));
    }

    // Get transactions
    @GetMapping("/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getTransactions(
            @PathVariable String accountNumber,
            Authentication auth) {
        return ResponseEntity.ok(
                transactionService.getTransactions(accountNumber, auth.getName()));
    }

    // Get transactions paginated
    @GetMapping("/{accountNumber}/paged")
    public ResponseEntity<Page<TransactionResponse>> getTransactionsPaged(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        return ResponseEntity.ok(
                transactionService.getTransactionsPaged(
                        accountNumber, auth.getName(), page, size));
    }
}