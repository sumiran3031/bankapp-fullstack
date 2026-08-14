package com.sumiran.bankapp.dto.transaction;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DepositRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum deposit is ₹1")
    @DecimalMax(value = "1000000.0", message = "Maximum deposit is ₹10,00,000")
    private BigDecimal amount;

    private String description = "Cash Deposit";
}