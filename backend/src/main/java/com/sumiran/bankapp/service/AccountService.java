package com.sumiran.bankapp.service;

import com.sumiran.bankapp.dto.account.*;
import com.sumiran.bankapp.entity.*;
import com.sumiran.bankapp.enums.*;
import com.sumiran.bankapp.exception.*;
import com.sumiran.bankapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Value("${app.account.prefix}")
    private String accountPrefix;

    public AccountResponse openAccount(String email, AccountRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .user(user)
                .accountType(request.getAccountType())
                .status(AccountStatus.ACTIVE)
                .balance(BigDecimal.ZERO)
                .minimumBalance(new BigDecimal("500.00"))
                .branchName(request.getBranchName())
                .build();

        return toResponse(accountRepository.save(account));
    }

    public List<AccountResponse> getMyAccounts(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return accountRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public AccountResponse getAccountByNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + accountNumber));
        return toResponse(account);
    }

    public AccountResponse closeAccount(String accountNumber, String email) {
        Account account = findAndValidateOwnership(accountNumber, email);

        if (account.getBalance().compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException(
                    "Cannot close account with balance. Please withdraw ₹" +
                            account.getBalance() + " first.");
        }

        account.setStatus(AccountStatus.CLOSED);
        return toResponse(accountRepository.save(account));
    }

    public Account findByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + accountNumber));
    }

    private Account findAndValidateOwnership(String accountNumber, String email) {
        Account account = findByAccountNumber(accountNumber);
        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: This is not your account");
        }
        return account;
    }

    private String generateAccountNumber() {
        String number;
        do {
            number = accountPrefix + String.format("%010d",
                    new Random().nextLong(9000000000L) + 1000000000L);
        } while (accountRepository.existsByAccountNumber(number));
        return number;
    }

    public AccountResponse toResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountHolderName(account.getUser().getFullName())
                .email(account.getUser().getEmail())
                .accountType(account.getAccountType())
                .status(account.getStatus())
                .balance(account.getBalance())
                .minimumBalance(account.getMinimumBalance())
                .ifscCode(account.getIfscCode())
                .branchName(account.getBranchName())
                .createdAt(account.getCreatedAt())
                .build();
    }
}