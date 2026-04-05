package com.expensetracker.controller;

import com.expensetracker.dto.FilterDTO;
import com.expensetracker.dto.TransactionDTO;
import com.expensetracker.dto.TransactionSummaryDTO;
import com.expensetracker.entity.Transaction.TransactionType;
import com.expensetracker.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TransactionController {

    private final TransactionService transactionService;

    /**
     * Get all transactions
     * GET /api/transactions
     */
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
        List<TransactionDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    /**
     * Get transaction by ID
     * GET /api/transactions/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(@PathVariable Long id) {
        TransactionDTO transaction = transactionService.getTransactionById(id);
        return ResponseEntity.ok(transaction);
    }

    /**
     * Create new transaction
     * POST /api/transactions
     */
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(@Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO createdTransaction = transactionService.createTransaction(transactionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTransaction);
    }

    /**
     * Update transaction
     * PUT /api/transactions/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDTO transactionDTO) {
        TransactionDTO updatedTransaction = transactionService.updateTransaction(id, transactionDTO);
        return ResponseEntity.ok(updatedTransaction);
    }

    /**
     * Delete transaction
     * DELETE /api/transactions/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get transaction summary (total income, expense, balance)
     * GET /api/transactions/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryDTO> getSummary() {
        TransactionSummaryDTO summary = transactionService.getSummary();
        return ResponseEntity.ok(summary);
    }

    /**
     * Filter transactions
     * GET /api/transactions/filter?type=INCOME&category=Salary&startDate=2024-01-01&endDate=2024-12-31
     */
    @GetMapping("/filter")
    public ResponseEntity<List<TransactionDTO>> filterTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        FilterDTO filter = new FilterDTO(type, category, startDate, endDate);
        List<TransactionDTO> transactions = transactionService.filterTransactions(filter);
        return ResponseEntity.ok(transactions);
    }
}
