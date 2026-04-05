package com.expensetracker.dto;

import com.expensetracker.entity.Transaction.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FilterDTO {
    private TransactionType type;
    private String category;
    private LocalDate startDate;
    private LocalDate endDate;
}
