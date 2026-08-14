package com.sumiran.bankapp.service;

import com.sumiran.bankapp.dto.account.AccountResponse;
import com.sumiran.bankapp.entity.*;
import com.sumiran.bankapp.enums.AccountStatus;
import com.sumiran.bankapp.exception.AccountNotFoundException;
import com.sumiran.bankapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalAccounts", accountRepository.count());
        stats.put("activeAccounts", accountRepository.countActiveAccounts());
        stats.put("totalDeposits",
                accountRepository.getTotalDeposits() != null
                        ? accountRepository.getTotalDeposits() : BigDecimal.ZERO);
        stats.put("totalTransactions", transactionRepository.getTotalTransactions());
        return stats;
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll()
                .stream().map(accountService::toResponse).toList();
    }

    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream().map(u -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", u.getId());
            map.put("fullName", u.getFullName());
            map.put("email", u.getEmail());
            map.put("phone", u.getPhone());
            map.put("role", u.getRole());
            map.put("isActive", u.getIsActive());
            map.put("createdAt", u.getCreatedAt());
            return map;
        }).toList();
    }

    public AccountResponse blockAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + accountNumber));
        account.setStatus(AccountStatus.BLOCKED);
        return accountService.toResponse(accountRepository.save(account));
    }

    public AccountResponse unblockAccount(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + accountNumber));
        account.setStatus(AccountStatus.ACTIVE);
        return accountService.toResponse(accountRepository.save(account));
    }
}