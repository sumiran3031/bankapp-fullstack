package com.sumiran.bankapp.service;

import com.sumiran.bankapp.dto.transaction.*;
import com.sumiran.bankapp.entity.*;
import com.sumiran.bankapp.enums.*;
import com.sumiran.bankapp.exception.*;
import com.sumiran.bankapp.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;
    private final AccountService accountService;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        Account account = accountService.findByAccountNumber(request.getAccountNumber());

        validateAccountActive(account);

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .transactionId(generateTxId())
                .account(account)
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request, String email) {
        Account account = accountService.findByAccountNumber(request.getAccountNumber());

        validateAccountActive(account);
        validateOwnership(account, email);

        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());

        if (newBalance.compareTo(account.getMinimumBalance()) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Available: ₹" + account.getBalance() +
                            ", Minimum balance required: ₹" + account.getMinimumBalance());
        }

        account.setBalance(newBalance);
        accountRepository.save(account);

        Transaction tx = Transaction.builder()
                .transactionId(generateTxId())
                .account(account)
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .balanceAfter(account.getBalance())
                .description(request.getDescription())
                .build();

        return toResponse(transactionRepository.save(tx));
    }

    @Transactional
    public Map<String, TransactionResponse> transfer(TransferRequest request, String email) {
        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new RuntimeException("Cannot transfer to same account");
        }

        Account fromAccount = accountService.findByAccountNumber(request.getFromAccountNumber());
        Account toAccount = accountService.findByAccountNumber(request.getToAccountNumber());

        validateAccountActive(fromAccount);
        validateAccountActive(toAccount);
        validateOwnership(fromAccount, email);

        BigDecimal newFromBalance = fromAccount.getBalance().subtract(request.getAmount());

        if (newFromBalance.compareTo(fromAccount.getMinimumBalance()) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Available: ₹" + fromAccount.getBalance());
        }

        fromAccount.setBalance(newFromBalance);
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        String txId = generateTxId();

        Transaction debit = Transaction.builder()
                .transactionId(txId + "-OUT")
                .account(fromAccount)
                .type(TransactionType.TRANSFER_OUT)
                .amount(request.getAmount())
                .balanceAfter(fromAccount.getBalance())
                .description(request.getDescription())
                .referenceAccountNumber(request.getToAccountNumber())
                .build();

        Transaction credit = Transaction.builder()
                .transactionId(txId + "-IN")
                .account(toAccount)
                .type(TransactionType.TRANSFER_IN)
                .amount(request.getAmount())
                .balanceAfter(toAccount.getBalance())
                .description(request.getDescription())
                .referenceAccountNumber(request.getFromAccountNumber())
                .build();

        transactionRepository.save(debit);
        transactionRepository.save(credit);

        return Map.of(
                "debit", toResponse(debit),
                "credit", toResponse(credit)
        );
    }

    public List<TransactionResponse> getTransactions(String accountNumber, String email) {
        Account account = accountService.findByAccountNumber(accountNumber);
        validateOwnership(account, email);

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(account.getId())
                .stream().map(this::toResponse).toList();
    }

    public Page<TransactionResponse> getTransactionsPaged(
            String accountNumber, String email, int page, int size) {
        Account account = accountService.findByAccountNumber(accountNumber);
        validateOwnership(account, email);

        return transactionRepository
                .findByAccountIdOrderByCreatedAtDesc(
                        account.getId(), PageRequest.of(page, size))
                .map(this::toResponse);
    }

    private void validateAccountActive(Account account) {
        if (account.getStatus() != AccountStatus.ACTIVE) {
            throw new RuntimeException("Account is " + account.getStatus() +
                    ". Cannot perform transactions.");
        }
    }

    private void validateOwnership(Account account, String email) {
        if (!account.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized: This is not your account");
        }
    }

    private String generateTxId() {
        return "TXN" + System.currentTimeMillis() +
                String.format("%04d", new Random().nextInt(9999));
    }

    private TransactionResponse toResponse(Transaction tx) {
        return TransactionResponse.builder()
                .id(tx.getId())
                .transactionId(tx.getTransactionId())
                .accountNumber(tx.getAccount().getAccountNumber())
                .type(tx.getType())
                .amount(tx.getAmount())
                .balanceAfter(tx.getBalanceAfter())
                .description(tx.getDescription())
                .referenceAccountNumber(tx.getReferenceAccountNumber())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}