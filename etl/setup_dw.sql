-- Script d'initialisation du Data Warehouse SmartWallet
-- À exécuter dans phpMyAdmin ou MySQL Workbench

CREATE DATABASE IF NOT EXISTS smartwallet_dw;
USE smartwallet_dw;

-- 1. Dimension Utilisateur
CREATE TABLE IF NOT EXISTS dim_user (
    user_key INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    registration_date DATE,
    country VARCHAR(50) DEFAULT 'Tunisia',
    created_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP,
    INDEX (user_id)
) ENGINE=InnoDB;

-- 2. Dimension Catégorie
CREATE TABLE IF NOT EXISTS dim_category (
    category_key INT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100),
    category_type VARCHAR(50),
    icon VARCHAR(10),
    INDEX (category_id)
) ENGINE=InnoDB;

-- 3. Dimension Compte
CREATE TABLE IF NOT EXISTS dim_account (
    account_key INT AUTO_INCREMENT PRIMARY KEY,
    account_id VARCHAR(50) UNIQUE NOT NULL,
    account_name VARCHAR(100),
    account_type VARCHAR(50),
    institution VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'TND',
    is_active BOOLEAN DEFAULT TRUE,
    INDEX (account_id)
) ENGINE=InnoDB;

-- 4. Dimension Temps
CREATE TABLE IF NOT EXISTS dim_date (
    date_key INT PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    day INT,
    month INT,
    month_name VARCHAR(20),
    quarter INT,
    year INT,
    day_of_week VARCHAR(20),
    is_weekend BOOLEAN
) ENGINE=InnoDB;

-- 5. Table de Faits : Transactions
CREATE TABLE IF NOT EXISTS fact_transaction (
    fact_key INT AUTO_INCREMENT PRIMARY KEY,
    user_key INT NOT NULL,
    category_key INT NOT NULL,
    account_key INT NOT NULL,
    date_key INT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    is_income BOOLEAN NOT NULL,
    transaction_count INT DEFAULT 1,
    
    FOREIGN KEY (user_key) REFERENCES dim_user(user_key),
    FOREIGN KEY (category_key) REFERENCES dim_category(category_key),
    FOREIGN KEY (account_key) REFERENCES dim_account(account_key),
    FOREIGN KEY (date_key) REFERENCES dim_date(date_key)
) ENGINE=InnoDB;

-- 6. Table de Faits : Budgets
CREATE TABLE IF NOT EXISTS fact_budget (
    fact_key INT AUTO_INCREMENT PRIMARY KEY,
    user_key INT NOT NULL,
    category_key INT,
    amount DECIMAL(15, 2) NOT NULL,
    spent DECIMAL(15, 2) DEFAULT 0,
    period VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    
    FOREIGN KEY (user_key) REFERENCES dim_user(user_key),
    FOREIGN KEY (category_key) REFERENCES dim_category(category_key)
) ENGINE=InnoDB;

-- 7. Table de Faits : Objectifs d'Épargne
CREATE TABLE IF NOT EXISTS fact_savings_goal (
    fact_key INT AUTO_INCREMENT PRIMARY KEY,
    user_key INT NOT NULL,
    goal_name VARCHAR(100),
    target_amount DECIMAL(15, 2) NOT NULL,
    current_amount DECIMAL(15, 2) DEFAULT 0,
    priority VARCHAR(20),
    deadline_key INT,
    
    FOREIGN KEY (user_key) REFERENCES dim_user(user_key),
    FOREIGN KEY (deadline_key) REFERENCES dim_date(date_key)
) ENGINE=InnoDB;

-- Table de métadonnées ETL
CREATE TABLE IF NOT EXISTS etl_metadata (
    id INT AUTO_INCREMENT PRIMARY KEY,
    run_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20),
    records_processed INT,
    error_message TEXT
) ENGINE=InnoDB;
