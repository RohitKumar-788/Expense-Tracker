-- =============================================
-- Expense Tracker Database Schema
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- =============================================
-- Transactions Table
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_category (category),
    INDEX idx_date (date),
    INDEX idx_type_date (type, date)
);

-- =============================================
-- Sample Data (Optional)
-- =============================================
INSERT INTO transactions (amount, type, category, date, description) VALUES
-- Current month income
(5000.00, 'INCOME', 'Salary', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Monthly salary'),
(500.00, 'INCOME', 'Freelance', DATE_SUB(CURDATE(), INTERVAL 10 DAY), 'Side project payment'),
(250.00, 'INCOME', 'Investments', DATE_SUB(CURDATE(), INTERVAL 15 DAY), 'Dividend payment'),

-- Current month expenses
(150.00, 'EXPENSE', 'Food & Dining', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Weekly groceries'),
(80.00, 'EXPENSE', 'Transportation', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Gas'),
(200.00, 'EXPENSE', 'Shopping', DATE_SUB(CURDATE(), INTERVAL 7 DAY), 'Clothes'),
(50.00, 'EXPENSE', 'Entertainment', DATE_SUB(CURDATE(), INTERVAL 8 DAY), 'Movie tickets'),
(120.00, 'EXPENSE', 'Bills & Utilities', DATE_SUB(CURDATE(), INTERVAL 12 DAY), 'Electricity bill'),

-- Last month
(5000.00, 'INCOME', 'Salary', DATE_SUB(CURDATE(), INTERVAL 35 DAY), 'Monthly salary'),
(180.00, 'EXPENSE', 'Food & Dining', DATE_SUB(CURDATE(), INTERVAL 32 DAY), 'Restaurant'),
(300.00, 'EXPENSE', 'Healthcare', DATE_SUB(CURDATE(), INTERVAL 40 DAY), 'Doctor visit'),

-- 2 months ago
(5000.00, 'INCOME', 'Salary', DATE_SUB(CURDATE(), INTERVAL 65 DAY), 'Monthly salary'),
(1000.00, 'INCOME', 'Freelance', DATE_SUB(CURDATE(), INTERVAL 60 DAY), 'Contract work'),
(400.00, 'EXPENSE', 'Shopping', DATE_SUB(CURDATE(), INTERVAL 55 DAY), 'Electronics'),
(100.00, 'EXPENSE', 'Entertainment', DATE_SUB(CURDATE(), INTERVAL 58 DAY), 'Concert tickets'),

-- 3 months ago
(5000.00, 'INCOME', 'Salary', DATE_SUB(CURDATE(), INTERVAL 95 DAY), 'Monthly salary'),
(600.00, 'EXPENSE', 'Travel', DATE_SUB(CURDATE(), INTERVAL 90 DAY), 'Weekend trip'),
(200.00, 'EXPENSE', 'Food & Dining', DATE_SUB(CURDATE(), INTERVAL 88 DAY), 'Fine dining'),
(150.00, 'EXPENSE', 'Education', DATE_SUB(CURDATE(), INTERVAL 92 DAY), 'Online course');

-- =============================================
-- Useful Queries
-- =============================================

-- Get transaction summary
-- SELECT 
--     SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as total_income,
--     SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as total_expense,
--     SUM(CASE WHEN type = 'INCOME' THEN amount ELSE -amount END) as balance,
--     COUNT(*) as transaction_count
-- FROM transactions;

-- Get expenses by category
-- SELECT category, SUM(amount) as total
-- FROM transactions
-- WHERE type = 'EXPENSE'
-- GROUP BY category
-- ORDER BY total DESC;

-- Get monthly income vs expense
-- SELECT 
--     DATE_FORMAT(date, '%Y-%m') as month,
--     SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
--     SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
-- FROM transactions
-- GROUP BY DATE_FORMAT(date, '%Y-%m')
-- ORDER BY month;
