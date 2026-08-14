package com.sumiran.bankapp.repository;

import com.sumiran.bankapp.entity.Account;
import com.sumiran.bankapp.enums.AccountStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    List<Account> findByUserId(Long userId);
    List<Account> findByStatus(AccountStatus status);
    boolean existsByAccountNumber(String accountNumber);

    @Query("SELECT SUM(a.balance) FROM Account a WHERE a.status = 'ACTIVE'")
    BigDecimal getTotalDeposits();

    @Query("SELECT COUNT(a) FROM Account a WHERE a.status = 'ACTIVE'")
    Long countActiveAccounts();
}