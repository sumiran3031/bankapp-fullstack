package com.sumiran.bankapp.dto.account;

import com.sumiran.bankapp.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountRequest {
    @NotNull(message = "Account type is required")
    private AccountType accountType;
    private String branchName = "Main Branch";
}