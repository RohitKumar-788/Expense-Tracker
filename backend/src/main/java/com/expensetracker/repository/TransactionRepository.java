package com.expensetracker.repository;

import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.Transaction.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    // Find by type
    List<Transaction> findByType(TransactionType type);

    // Find by category
    List<Transaction> findByCategory(String category);

    // Find by date range
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    // Find by type and date range
    List<Transaction> findByTypeAndDateBetween(TransactionType type, LocalDate startDate, LocalDate endDate);

    // Find by category and date range
    List<Transaction> findByCategoryAndDateBetween(String category, LocalDate startDate, LocalDate endDate);

    // Custom query for filtering
    @Query("SELECT t FROM Transaction t WHERE " +
           "(:type IS NULL OR t.type = :type) AND " +
           "(:category IS NULL OR t.category = :category) AND " +
           "(:startDate IS NULL OR t.date >= :startDate) AND " +
           "(:endDate IS NULL OR t.date <= :endDate) " +
           "ORDER BY t.date DESC")
    List<Transaction> findWithFilters(
            @Param("type") TransactionType type,
            @Param("category") String category,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    // Get total income
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'INCOME'")
    BigDecimal getTotalIncome();

    // Get total expense
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = 'EXPENSE'")
    BigDecimal getTotalExpense();

    // Count transactions
    @Query("SELECT COUNT(t) FROM Transaction t")
    Long getTransactionCount();
}
