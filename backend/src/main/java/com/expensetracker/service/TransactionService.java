package com.expensetracker.service;

import com.expensetracker.dto.FilterDTO;
import com.expensetracker.dto.TransactionDTO;
import com.expensetracker.dto.TransactionSummaryDTO;
import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.Transaction.TransactionType;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionService {

    private final TransactionRepository transactionRepository;

    // Get all transactions
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get transaction by ID
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return convertToDTO(transaction);
    }

    // Create transaction
    public TransactionDTO createTransaction(TransactionDTO dto) {
        Transaction transaction = convertToEntity(dto);
        Transaction savedTransaction = transactionRepository.save(transaction);
        return convertToDTO(savedTransaction);
    }

    // Update transaction
    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        Transaction existingTransaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        existingTransaction.setAmount(dto.getAmount());
        existingTransaction.setType(dto.getType());
        existingTransaction.setCategory(dto.getCategory());
        existingTransaction.setDate(dto.getDate());
        existingTransaction.setDescription(dto.getDescription());

        Transaction updatedTransaction = transactionRepository.save(existingTransaction);
        return convertToDTO(updatedTransaction);
    }

    // Delete transaction
    public void deleteTransaction(Long id) {
        if (!transactionRepository.existsById(id)) {
            throw new RuntimeException("Transaction not found with id: " + id);
        }
        transactionRepository.deleteById(id);
    }

    // Get summary
    public TransactionSummaryDTO getSummary() {
        BigDecimal totalIncome = transactionRepository.getTotalIncome();
        BigDecimal totalExpense = transactionRepository.getTotalExpense();
        BigDecimal balance = totalIncome.subtract(totalExpense);
        Long transactionCount = transactionRepository.getTransactionCount();

        return new TransactionSummaryDTO(totalIncome, totalExpense, balance, transactionCount);
    }

    // Filter transactions
    public List<TransactionDTO> filterTransactions(FilterDTO filter) {
        return transactionRepository.findWithFilters(
                        filter.getType(),
                        filter.getCategory(),
                        filter.getStartDate(),
                        filter.getEndDate()
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods
    private TransactionDTO convertToDTO(Transaction transaction) {
        return new TransactionDTO(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getDate(),
                transaction.getDescription()
        );
    }

    private Transaction convertToEntity(TransactionDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setAmount(dto.getAmount());
        transaction.setType(dto.getType());
        transaction.setCategory(dto.getCategory());
        transaction.setDate(dto.getDate());
        transaction.setDescription(dto.getDescription());
        return transaction;
    }
}
