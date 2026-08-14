package com.sumiran.bankapp.dto.transaction;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class WithdrawRequest {
    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum withdrawal is ₹1")
    private BigDecimal amount;

    private String description = "Cash Withdrawal";
}