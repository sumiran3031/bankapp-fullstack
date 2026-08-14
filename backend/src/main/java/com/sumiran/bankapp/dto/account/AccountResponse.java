package com.sumiran.bankapp.dto.account;

import com.sumiran.bankapp.enums.AccountStatus;
import com.sumiran.bankapp.enums.AccountType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AccountResponse {
    private Long id;
    private String accountNumber;
    private String accountHolderName;
    private String email;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal balance;
    private BigDecimal minimumBalance;
    private String ifscCode;
    private String branchName;
    private LocalDateTime createdAt;
}