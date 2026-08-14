package com.sumiran.bankapp.dto.transaction;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    @NotBlank(message = "From account is required")
    private String fromAccountNumber;

    @NotBlank(message = "To account is required")
    private String toAccountNumber;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Minimum transfer is ₹1")
    private BigDecimal amount;

    private String description = "Fund Transfer";
}