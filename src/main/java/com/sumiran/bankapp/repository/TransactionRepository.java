package com.sumiran.bankapp.repository;

import com.sumiran.bankapp.entity.Transaction;
import com.sumiran.bankapp.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId);
    Page<Transaction> findByAccountIdOrderByCreatedAtDesc(Long accountId, Pageable pageable);
    Optional<Transaction> findByTransactionId(String transactionId);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.type = :type")
    BigDecimal getTotalByType(TransactionType type);

    @Query("SELECT COUNT(t) FROM Transaction t")
    Long getTotalTransactions();
}